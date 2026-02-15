import { Agence } from '@/interface/agence';
import { DemandeCredit } from '@/interface/demande.credit';
import { NewCredit } from '@/interface/newCredit';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Popover, PopoverModule } from 'primeng/popover';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-resp-agent',
    imports: [CommonModule, TableModule, InputIconModule, IconFieldModule, TagModule, PopoverModule, ButtonModule, ToastModule, ProgressSpinnerModule, ChipModule, CardModule, DividerModule, TabViewModule, BadgeModule, DialogModule, ReactiveFormsModule, TextareaModule],
    templateUrl: './resp-agent.component.html'
})
export class RespAgentComponent {
    @Input() user?: IUser;
    state = signal<{
        demandeAnalyseCredits?: DemandeCredit[];
        agence?: Agence;
        creditDtos?: NewCredit[];
        filteredDemandeAttentes?: NewCredit[];
        demandesRejetees?: any[];
        // Workflow hierarchique
        workflowAValider: any[];
        workflowCorrectionDR: any[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        filteredDemandeAttentes: [],
        demandeAnalyseCredits: [],
        demandesRejetees: [],
        workflowAValider: [],
        workflowCorrectionDR: []
    });

    // Workflow dialogs
    showWorkflowValidationDialog = false;
    showWorkflowRejetDialog = false;
    selectedWorkflowDemande: any = null;

    workflowValidationForm: FormGroup;
    workflowRejetForm: FormGroup;

    workflowSectionsOptions = [
        { label: 'Collecte des donnees', value: 'COLLECTE' },
        { label: 'Bilan d\'activite', value: 'BILAN_ACTIVITE' },
        { label: 'Flux de tresorerie', value: 'FLUX_TRESORERIE' },
        { label: 'Amortissements', value: 'AMORTISSEMENTS' },
        { label: 'Rentabilite', value: 'RENTABILITE' },
        { label: 'Ratios financiers', value: 'RATIOS' },
        { label: 'Personne caution', value: 'PERSONNE_CAUTION' },
        { label: 'Garantie proposee', value: 'GARANTIE' },
        { label: 'Demande complete', value: 'DEMANDE_COMPLETE' }
    ];

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    constructor() {
        this.workflowValidationForm = this.fb.group({
            avis: ['', [Validators.required, Validators.minLength(10)]]
        });
        this.workflowRejetForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructions: ['']
        });
    }

    getStatusLabel(statutDemande: string, validationState: string): string {
        if (statutDemande === 'EN_ATTENTE' && validationState === 'NOUVEAU') {
            return 'NOUVELLE DEMANDE';
        } else if (statutDemande === 'EN_ATTENTE' && validationState === 'SELECTION') {
            return 'SELECTION';
        }
        return statutDemande;
    }

    ngOnInit(): void {
        this.laodAllCreditByAgence();
        this.loadDemandesRejetees();
        this.loadWorkflowAValiderDA();
        this.loadWorkflowCorrectionDR();
    }

    getStateValidation(statut: string): string {
        if (statut === 'ENCOURS') {
            return 'EN ATTENTE POUR LA NOTATION';
        } else if (statut === 'VALIDE') {
            return 'DEMANDE APROUVEE PAR LE DIRECTEUR';
        } else if (statut === 'REJECTED') {
            return 'DEMANDE REJETEE PAR LE DIRECTEUR';
        }
        return statut;
    }

    onGlobalFilter(table: any, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getStatusSeverity(statut: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        if (statut === 'ENCOURS') return 'info';
        if (statut === 'VALIDE') return 'success';
        if (statut === 'REJECTED') return 'danger';
        return undefined;
    }

    // NEW: Get severity for demandeAnalyseCredits status
    getAnalyseStatusSeverity(statut: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (statut?.toUpperCase()) {
            case 'VUE':
                return 'info';
            case 'EN_ATTENTE':
                return 'warn';
            case 'APPROUVE':
                return 'success';
            case 'REJETE':
                return 'danger';
            case 'EN_COURS':
                return 'info';
            default:
                return 'secondary';
        }
    }

    // NEW: Get label for demandeAnalyseCredits status
    getAnalyseStatusLabel(statut: string): string {
        switch (statut?.toUpperCase()) {
            case 'VUE':
                return 'Vue';
            case 'EN_ATTENTE':
                return 'En attente';
            case 'APPROUVE':
                return 'Approuvé';
            case 'REJETE':
                return 'Rejeté';
            case 'EN_COURS':
                return 'En cours';
            default:
                return statut || 'Inconnu';
        }
    }

    // Méthode pour formater le montant en GNF
    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    // Méthode pour calculer le total des montants
    getTotalMontant(): number {
        return this.state().filteredDemandeAttentes?.reduce((total, demande) => total + (demande.montantCredit || 0), 0) || 0;
    }

    // NEW: Check if there are demandeAnalyseCredits
    hasAnalyseCredits(): boolean {
        return !!(this.state().demandeAnalyseCredits && this.state().demandeAnalyseCredits!.length > 0);
    }

    // Analyse credits groupées par jour et triées par date décroissante
    analyseCreditsGrouped = computed(() => {
        const credits = this.state().demandeAnalyseCredits || [];
        return credits
            .map((d: any) => ({
                ...d,
                dateGroup: d.dateDemande ? d.dateDemande.substring(0, 10) : '1970-01-01'
            }))
            .sort((a: any, b: any) => {
                if (a.dateGroup !== b.dateGroup) {
                    return b.dateGroup.localeCompare(a.dateGroup);
                }
                return 0;
            });
    });

    // Nombre d'analyses pour un jour donné
    getAnalyseCountForDate(dateGroup: string): number {
        return this.analyseCreditsGrouped().filter((d: any) => d.dateGroup === dateGroup).length;
    }

    // Montant total pour un jour donné
    getAnalyseTotalForDate(dateGroup: string): number {
        return this.analyseCreditsGrouped()
            .filter((d: any) => d.dateGroup === dateGroup)
            .reduce((total: number, d: any) => total + (d.montantDemande || 0), 0);
    }

    // Formater la date du groupe en français
    formatDateGroup(dateGroup: string): string {
        const date = new Date(dateGroup + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const groupDate = new Date(date);
        groupDate.setHours(0, 0, 0, 0);

        if (groupDate.getTime() === today.getTime()) {
            return "Aujourd'hui";
        } else if (groupDate.getTime() === yesterday.getTime()) {
            return 'Hier';
        }

        const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    }

    // NEW: Format date for display
    formatDate(dateString: string | null): string {
        if (!dateString) return 'Non définie';

        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    private laodAllCreditByAgence(): void {
        this.state.set({ ...this.state(), loading: true });

        this.userService
            .getListCreditEnAttente$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('🔍 Response reçue:', response);

                    // Handle creditDtos
                    const allCredits = Array.isArray(response.data.creditDtos) ? response.data.creditDtos : response.data.creditDtos ? [response.data.creditDtos] : [];
                    const filteredDemandes = allCredits.filter((demande) => demande.status === 'ENCOURS');

                    // Handle demandeAnalyseCredits
                    const analyseCredits = Array.isArray(response.data.demandeAnalyseCredits) ? response.data.demandeAnalyseCredits : response.data.demandeAnalyseCredits ? [response.data.demandeAnalyseCredits] : [];

                    console.log("📊 Demandes d'analyse trouvées:", analyseCredits);

                    this.state.set({
                        ...this.state(),
                        creditDtos: allCredits,
                        filteredDemandeAttentes: filteredDemandes,
                        demandeAnalyseCredits: analyseCredits, // NEW: Set the analyse credits
                        agence: response.data.agence,
                        loading: false
                    });

                    // Show notification if there are analyse credits
                    if (analyseCredits.length > 0) {
                        this.messageService.add({
                            severity: 'info',
                            summary: "Demandes d'analyse disponibles",
                            detail: `${analyseCredits.length} demande(s) d'analyse de crédit trouvée(s)`,
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error loading credits:', error);
                    this.state.set({
                        ...this.state(),
                        error: 'Erreur lors du chargement des informations des demandes en attente de credit',
                        loading: false
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations du des demandes en attente de credit',
                        life: 5000
                    });
                },
                complete: () => {}
            });
    }

    toggleDataTable(popover: Popover, event: Event): void {
        popover.toggle(event);
    }

    // NEW: Toggle analyse credits table
    toggleAnalyseTable(popover: Popover, event: Event): void {
        popover.toggle(event);
    }

    // Optional: If you want to handle selection like in the example
    selectedDemande: any;

    onDemandeSelect(popover: Popover, event: any): void {
        this.selectedDemande = event.data;
        popover.hide();
        this.messageService.add({
            severity: 'info',
            summary: 'Demande Sélectionnée',
            detail: `Membre: ${this.selectedDemande.codeMembre} ${this.selectedDemande.nom}`,
            life: 3000
        });
    }

    viewInstanceCredit(referenceCredit: string, numeroMembre: string, userId: number): void {
        console.log('viewInstanceCredit', referenceCredit, numeroMembre, userId);
        this.router.navigate(['/dashboards/resp-agent/', referenceCredit, numeroMembre, userId]);
    }

    // NEW: Navigate to analyse credit details
    viewAnalyseCredit(demandeCreditId: number, userId: number): void {
        console.log('viewAnalyseCredit', demandeCreditId, userId);
        this.router.navigate([`dashboards/credit/${userId}/resume-credit/${demandeCreditId}`]);
    }

    private loadDemandesRejetees(): void {
        this.userService
            .getDemandesRejetees$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const rejets = Array.isArray(response.data.demandesRejetees) ? response.data.demandesRejetees : [];
                    this.state.set({
                        ...this.state(),
                        demandesRejetees: rejets
                    });
                },
                error: (error) => {
                    console.error('Error loading demandes rejetees:', error);
                }
            });
    }

    hasDemandesRejetees(): boolean {
        return !!(this.state().demandesRejetees && this.state().demandesRejetees!.length > 0);
    }

    getCorrectionSeverity(statutCorrection: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (statutCorrection) {
            case 'CORRIGE':
                return 'success';
            case 'EN_COURS_CORRECTION':
                return 'warn';
            case 'EN_ATTENTE_CORRECTION':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    getCorrectionLabel(statutCorrection: string): string {
        switch (statutCorrection) {
            case 'CORRIGE':
                return 'Corrige et re-soumis';
            case 'EN_COURS_CORRECTION':
                return 'En cours de correction';
            case 'EN_ATTENTE_CORRECTION':
                return 'En attente de correction';
            default:
                return statutCorrection || 'Inconnu';
        }
    }

    getTypeValidationLabel(type: string): string {
        switch (type) {
            case 'BILAN_ACTIVITE':
                return "Bilan d'activite";
            case 'FLUX_TRESORERIE':
                return 'Flux de tresorerie';
            default:
                return type;
        }
    }

    viewDemandeDetail(demandeindividuelId: number): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', demandeindividuelId]);
    }

    // Méthode pour rafraîchir les données
    refreshData(): void {
        this.laodAllCreditByAgence();
        this.loadDemandesRejetees();
        this.loadWorkflowAValiderDA();
        this.loadWorkflowCorrectionDR();
        this.messageService.add({
            severity: 'info',
            summary: 'Actualisation',
            detail: 'Données actualisées avec succès',
            life: 2000
        });
    }

    // ==================== WORKFLOW HIERARCHIQUE ====================

    private loadWorkflowAValiderDA(): void {
        this.userService.getAValiderDA$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update(s => ({
                        ...s,
                        workflowAValider: response.data?.workflowDemandes || []
                    }));
                },
                error: () => {}
            });
    }

    private loadWorkflowCorrectionDR(): void {
        this.userService.getEnCorrectionDR$()
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

    hasWorkflowAValider(): boolean {
        return this.state().workflowAValider.length > 0;
    }

    hasWorkflowCorrectionDR(): boolean {
        return this.state().workflowCorrectionDR.length > 0;
    }

    ouvrirWorkflowValidation(demande: any): void {
        this.selectedWorkflowDemande = demande;
        this.workflowValidationForm.reset();
        this.showWorkflowValidationDialog = true;
    }

    ouvrirWorkflowRejet(demande: any): void {
        this.selectedWorkflowDemande = demande;
        this.workflowRejetForm.reset();
        this.showWorkflowRejetDialog = true;
    }

    confirmerWorkflowValidation(): void {
        if (this.workflowValidationForm.invalid || !this.selectedWorkflowDemande) return;

        this.userService.validerDA$(this.selectedWorkflowDemande.demandeIndividuelId, this.workflowValidationForm.value.avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Demande validee par DA', life: 3000 });
                    this.showWorkflowValidationDialog = false;
                    this.loadWorkflowAValiderDA();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors de la validation', life: 5000 });
                }
            });
    }

    confirmerWorkflowRejet(): void {
        if (this.workflowRejetForm.invalid || !this.selectedWorkflowDemande) return;

        const body = {
            motifRejet: this.workflowRejetForm.value.motifRejet,
            sectionsARevoir: this.workflowRejetForm.value.sectionsARevoir,
            instructions: this.workflowRejetForm.value.instructions || undefined
        };

        this.userService.rejeterDA$(this.selectedWorkflowDemande.demandeIndividuelId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: 'Demande rejetee par DA', life: 3000 });
                    this.showWorkflowRejetDialog = false;
                    this.loadWorkflowAValiderDA();
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }

    toggleWorkflowSection(value: string, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const current: string[] = this.workflowRejetForm.get('sectionsARevoir')?.value || [];
        if (checkbox.checked) {
            this.workflowRejetForm.get('sectionsARevoir')?.setValue([...current, value]);
        } else {
            this.workflowRejetForm.get('sectionsARevoir')?.setValue(current.filter(v => v !== value));
        }
        this.workflowRejetForm.get('sectionsARevoir')?.markAsTouched();
    }
}
