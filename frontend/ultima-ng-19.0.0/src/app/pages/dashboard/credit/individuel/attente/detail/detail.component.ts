import { AnalyseChargesFonctionnaire, DemandeFonctionnaire, DemandeIndividuel, PieceJointeDemande, TYPE_CONTRAT_OPTIONS_FONCTIONNAIRE, demandeFonctionnaireVide, quotiteCessibleFonctionnaire } from '@/interface/demande-individuel.interface';
import { NiveauValidationFinale, libelleNiveauValidation, niveauValidationFinale } from '@/interface/validation-seuils';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr, 'fr-FR');
import { DemandeCredit } from '@/interface/demande.credit';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { Personnecaution } from '@/interface/personnecaution';
import { Selection } from '@/interface/selection';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap, EMPTY } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Avis } from '@/interface/avis';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';
import { environment } from 'src/environments/environment';
import { SyntheseDeComponent } from './synthese-de/synthese-de.component';

@Component({
    selector: 'app-detail',
    imports: [
        CommonModule,
        InputTextModule,
        FluidModule,
        ButtonModule,
        SelectModule,
        FormsModule,
        TextareaModule,
        TableModule,
        DividerModule,
        IconFieldModule,
        InputIconModule,
        ProgressSpinnerModule,
        MessageModule,
        DropdownModule,
        ReactiveFormsModule,
        ToastModule,
        ImageModule,
        CardModule,
        DialogModule,
        TooltipModule,
        BadgeModule,
        TagModule,
        ConfirmDialogModule,
        RouterLink,
        AvatarModule,
        ChipModule,
        TimelineModule,
        SyntheseDeComponent
    ],
    templateUrl: './detail.component.html',
    styleUrls: ['./detail.component.scss'],

    providers: [MessageService, ConfirmationService]
})
export class DetailComponent {
    state = signal<{
        user?: IUser;
        pointVentes?: PointVente[];
        pointVente?: PointVente;
        agentUsers?: { label: string; value: string }[];
        demandeIndividuel?: DemandeIndividuel;
        demande_credit?: DemandeCredit;
        documents?: Selection[];
        personnesCaution?: Personnecaution[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        statusOptions: { label: string; value: string }[];
        showPreviewDialog: boolean;
        selectedDocumentForPreview: Selection | null;
        showPDFPreview: boolean;
        selectedPDFDocument: Selection | null;
        pdfBlobUrl: string | null;
        hasDemandeCredit?: boolean;
        hasDossierCredit?: boolean;
        hasAnalyseFinanciere?: boolean;
        analyseStatut?: string;
        analyseFinanciere?: any;
        avisList: Avis[];
        loadingAvis: boolean;
        showAvisForm: boolean;
        userHasAvis: boolean;
        currentUserAvis?: Avis;
        submittingAvis: boolean;
        editingAvis: boolean;
        editingAvisId?: number;
        deletingAvisId?: number;
        validationDA: {
            bilan: { statut: string; motifRejet?: string; sectionsARevoir?: string[]; instructionsAc?: string; valideParNom?: string; dateValidation?: string; dateRejet?: string } | null;
            flux: { statut: string; motifRejet?: string; sectionsARevoir?: string[]; instructionsAc?: string; valideParNom?: string; dateValidation?: string; dateRejet?: string } | null;
        };
        showModalRejetBilan: boolean;
        showModalRejetFlux: boolean;
        showWorkflowRejetDA: boolean;
        showWorkflowRejetDR: boolean;
        analyseChargesFonctionnaire?: AnalyseChargesFonctionnaire | null;
        piecesFonctionnaire?: PieceJointeDemande[];
        showTransformationFonctionnaire?: boolean;
        transformationEnCours?: boolean;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        statusOptions: [],
        showPreviewDialog: false,
        selectedDocumentForPreview: null,
        showPDFPreview: false,
        selectedPDFDocument: null,
        pdfBlobUrl: null,
        avisList: [],
        loadingAvis: false,
        showAvisForm: true,
        userHasAvis: false,
        currentUserAvis: undefined,
        submittingAvis: false,
        editingAvis: false,
        editingAvisId: undefined,
        deletingAvisId: undefined,
        validationDA: { bilan: null, flux: null },
        showModalRejetBilan: false,
        showModalRejetFlux: false,
        showWorkflowRejetDA: false,
        showWorkflowRejetDR: false
    });

    updateForm: FormGroup;
    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private domSanitizer: DomSanitizer = inject(DomSanitizer);

    // Ajouter le formulaire pour les avis
    avisForm: FormGroup;

    // Formulaires pour rejet DA
    rejetBilanForm: FormGroup;
    rejetFluxForm: FormGroup;

    // Formulaires workflow DA
    workflowDAForm: FormGroup;
    workflowDARejetForm: FormGroup;

    // Formulaires workflow DR
    workflowDRForm: FormGroup;
    workflowDRRejetForm: FormGroup;

    workflowSectionsOptions = [
        { label: 'Collecte des donnees', value: 'COLLECTE' },
        { label: "Bilan d'activite", value: 'BILAN_ACTIVITE' },
        { label: 'Flux de tresorerie', value: 'FLUX_TRESORERIE' },
        { label: 'Amortissements', value: 'AMORTISSEMENTS' },
        { label: 'Rentabilite', value: 'RENTABILITE' },
        { label: 'Ratios financiers', value: 'RATIOS' },
        { label: 'Personne caution', value: 'PERSONNE_CAUTION' },
        { label: 'Garantie proposee', value: 'GARANTIE' },
        { label: 'Documents incomplets', value: 'DOCUMENTS_INCOMPLETS' },
        { label: 'Demande complete', value: 'DEMANDE_COMPLETE' }
    ];

    /** Sections à revoir pour le crédit fonctionnaire : ni bilan/flux ni garanties. */
    workflowSectionsOptionsFonctionnaire = [
        { label: 'Collecte des donnees', value: 'COLLECTE' },
        { label: 'Analyse charges & quotite', value: 'ANALYSE_CHARGES' },
        { label: 'Documents incomplets', value: 'DOCUMENTS_INCOMPLETS' },
        { label: 'Demande complete', value: 'DEMANDE_COMPLETE' }
    ];

    getWorkflowSectionsOptions(): { label: string; value: string }[] {
        return this.isFonctionnaireNature() ? this.workflowSectionsOptionsFonctionnaire : this.workflowSectionsOptions;
    }

    // Options sections pour rejet
    sectionsBilanOptions = [
        { label: 'Collecte des données', value: 'COLLECTE' },
        { label: 'Amortissements', value: 'AMORTISSEMENTS' },
        { label: 'Bilan', value: 'BILAN' },
        { label: 'Rentabilité', value: 'RENTABILITE' },
        { label: 'Besoin en crédit', value: 'BESOIN_CREDIT' },
        { label: 'Ratios financiers', value: 'RATIOS' },
        { label: 'Personne caution', value: 'PERSONNE_CAUTION' }
    ];

    sectionsFluxOptions = [
        { label: 'Flux client', value: 'FLUX_CLIENT' },
        { label: 'Flux associé', value: 'FLUX_ASSOCIE' },
        { label: 'Projection N+1', value: 'PROJECTION_N1' }
    ];

    constructor() {
        this.updateForm = this.fb.group({
            code: ['', Validators.required],
            codAgent: ['', [Validators.required]],
            statut: ['', Validators.required]
        });

        this.avisForm = this.fb.group({
            libele: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });

        this.rejetBilanForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructionsAc: ['']
        });

        this.rejetFluxForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructionsAc: ['']
        });

        this.workflowDAForm = this.fb.group({
            avis: ['', [Validators.required, Validators.minLength(10)]]
        });
        this.workflowDARejetForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructions: ['']
        });

        this.workflowDRForm = this.fb.group({
            avis: ['', [Validators.required, Validators.minLength(10)]]
        });
        this.workflowDRRejetForm = this.fb.group({
            motifRejet: ['', [Validators.required, Validators.minLength(10)]],
            sectionsARevoir: [[], [Validators.required]],
            instructions: ['']
        });
    }

    ngOnInit(): void {
        this.loadDemandeWithGaranties();
    }

    // ======================== AFFECTATION DA (circuit accueil) ========================

    /** Agents de credit eligibles (agence du DA, sans fonction Accueil) et selection. */
    agentsEligibles: { label: string; value: number }[] = [];
    agentAffectation: { label: string; value: number } | null = null;
    affectationEnCours = false;

    /** La demande a ete receptionnee par l'accueil : le DA doit l'affecter a un agent de credit. */
    isAffectationDA(): boolean {
        return this.state().user?.role === 'DA' && this.state().demandeIndividuel?.validationState === 'EN_ATTENTE_DA';
    }

    private loadAgentsEligibles(): void {
        this.userService
            .getAgentsCreditEligibles$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const agents = (response.data as any)?.agents || [];
                    this.agentsEligibles = agents.map((a: any) => ({
                        label: `${a.firstName} ${a.lastName}${a.pointventeLibele ? ' — ' + a.pointventeLibele : ''}${a.fonctionAccueil ? ' (accueil + crédit)' : ''}`,
                        value: a.userId
                    }));
                },
                error: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Agents indisponibles', detail: 'Impossible de charger la liste des agents de crédit', life: 5000 });
                }
            });
    }

    /** Le DA affecte la demande receptionnee a l'agent de credit choisi (-> AFFECTEE). */
    affecterDemande(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId || !this.agentAffectation) return;

        this.affectationEnCours = true;
        this.userService
            .affecterAC$(+demandeId, this.agentAffectation.value)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Demande affectée',
                        detail: `Demande affectée à ${this.agentAffectation?.label}`,
                        life: 4000
                    });
                    this.affectationEnCours = false;
                    setTimeout(() => this.router.navigate(['/dashboards/credit/individuel/attente']), 1500);
                },
                error: (error) => {
                    this.affectationEnCours = false;
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || error.message || "Échec de l'affectation",
                        life: 6000
                    });
                }
            });
    }

    canSubmitForm(): boolean {
        return this.updateForm.valid;
    }

    /**
     * Direction Exploitation : un MANAGER rattaché au service « DE ».
     * Pour ce profil, la page détail affiche une synthèse consolidée en lecture
     * seule (composant dédié) à la place de l'affichage standard.
     */
    isDE(): boolean {
        return this.state().user?.role === 'MANAGER' && this.state().user?.service === 'DE';
    }

    /** Directeur General : voit la meme synthese consolidee (lecture seule) que le DE. */
    isDG(): boolean {
        return this.state().user?.role === 'DG';
    }

    onAgentCodeChange(codAgent: string): void {
        const upperValue = codAgent?.trim()?.toUpperCase();
        this.updateForm.get('codAgent')?.setValue(upperValue, { emitEvent: false });
    }

    /**
     * Nouvelle méthode utilisant getDemandeWithGaranties$
     */
    private loadDemandeWithGaranties(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const demandeindividuelId = params.get('demandeindividuelId');

                    if (demandeindividuelId) {
                        this.state.update((s) => ({
                            ...s,
                            loading: true,
                            message: 'Chargement de la demande avec garanties...',
                            error: undefined
                        }));

                        return this.userService.getDemandeWithGaranties$(+demandeindividuelId);
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            loading: false,
                            error: 'ID de demande invalide ou inexistant'
                        }));
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Réponse complète avec garanties:', response);

                    const demandeData = response.data.demandeIndividuel;

                    if (demandeData) {
                        const statusOptions: { label: string; value: string }[] = [];
                        if (demandeData.statutDemande === 'EN_ATTENTE' && demandeData.validationState === 'NOUVEAU') {
                            statusOptions.push({ label: 'AFFECTATION', value: 'SELECTION' });
                        } else {
                            // Bloc "Traitement" masque hors phase d'affectation : la validation passe
                            // par les formulaires DA/DR/DE/DG. Pas d'etat 'VALIDATION' (non valide dans
                            // la machine a etats) — on ne propose aucune option ici.
                        }

                        const responseData = response.data as any;
                        this.state.update((s) => ({
                            ...s,
                            demandeIndividuel: demandeData,
                            statusOptions: statusOptions,
                            user: responseData.user,
                            demande_credit: responseData.demande_credit,
                            hasDemandeCredit: responseData.hasDemandeCredit,
                            hasDossierCredit: responseData.hasDossierCredit,
                            hasAnalyseFinanciere: responseData.hasAnalyseFinanciere,
                            analyseStatut: responseData.analyseStatut,
                            analyseFinanciere: responseData.analyseFinanciere,
                            loading: false,
                            message: `Demande chargée avec ${demandeData.garanties?.length || 0} garantie(s)`,
                            error: undefined
                        }));

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `Demande chargée avec ${demandeData.garanties?.length || 0} garantie(s)`,
                            life: 3000
                        });

                        if (demandeData.agence) {
                            this.loadPointVentes(demandeData.agence);
                        }

                        // Circuit accueil : la demande attend son affectation par le DA
                        if (responseData.user?.role === 'DA' && demandeData.validationState === 'EN_ATTENTE_DA') {
                            this.loadAgentsEligibles();
                        }

                        this.loadDocuments(+demandeData.demandeIndividuelId!);
                        this.loadPersonnesCaution(+demandeData.demandeIndividuelId!);

                        // Charger les avis
                        this.loadAvis(+demandeData.demandeIndividuelId!);

                        // Charger les statuts de validation DA
                        this.loadValidationDA(+demandeData.demandeIndividuelId!);

                        // Crédit fonctionnaire : analyse charges & quotité (affichage + impression)
                        if (demandeData.natureClient === 'Demande de credit Pour Fonctionnaire') {
                            this.loadAnalyseChargesFonctionnaire(+demandeData.demandeIndividuelId!);
                        }

                        if (demandeData.pos) {
                            this.loadPointVenteInfo(demandeData.pos);
                        }
                    }
                },
                error: (error: any) => {
                    console.error('Erreur lors du chargement de la demande:', error);
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: error.message || 'Erreur lors du chargement de la demande'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la demande',
                        life: 5000
                    });
                }
            });
    }
    // Méthode helper pour s'assurer qu'on a un tableau
    private ensureArray<T>(data: T | T[] | undefined | null): T[] {
        if (!data) return [];
        return Array.isArray(data) ? data : [data];
    }
    /**
     * Charger tous les avis de la demande
     */
    private loadAvis(demandeId: number): void {
        this.state.update((s) => ({ ...s, loadingAvis: true }));

        this.userService
            .getAvisByDemande$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const avisList: Avis[] = this.ensureArray<Avis>(response.data?.avis);
                    const currentUserId = this.state().user?.userId;

                    const userAvis = avisList.find((avis: Avis) => avis.idUser === currentUserId);

                    this.state.update((s) => ({
                        ...s,
                        avisList: avisList,
                        loadingAvis: false,
                        userHasAvis: !!userAvis,
                        currentUserAvis: userAvis,
                        showAvisForm: !userAvis && !s.editingAvis
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des avis:', error);
                    this.state.update((s) => ({
                        ...s,
                        loadingAvis: false,
                        avisList: []
                    }));
                }
            });
    }

    /**
     * Obtenir le label du rôle pour l'affichage
     */
    getRoleLabel(role: string): string {
        const roleLabels: { [key: string]: string } = {
            AGENT_CREDIT: 'Agent de Crédit',
            DR: 'Directeur Régional',
            DA: "Directeur d'Agence",
            MANAGER: 'Manager'
        };
        return roleLabels[role] || role;
    }

    /**
     * Formater la date pour l'affichage
     */
    formatDate(date: Date | string | undefined): string {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Obtenir la couleur du badge selon le rôle
     */
    getRoleSeverity(role: string): 'success' | 'info' | 'warn' | 'danger' | undefined {
        const severityMap: { [key: string]: any } = {
            AGENT_CREDIT: 'info',
            DR: 'danger',
            DA: 'warn',
            MANAGER: 'success'
        };
        return severityMap[role] || 'secondary';
    }

    /**
     * Soumettre un nouvel avis
     */
    submitAvis(): void {
        if (this.avisForm.invalid) {
            this.avisForm.markAllAsTouched();
            return;
        }

        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID de la demande non trouvé'
            });
            return;
        }

        // Vérifier si on est en mode édition ou création
        if (this.state().editingAvis && this.state().editingAvisId) {
            this.updateAvis();
        } else {
            this.createAvis();
        }
    }

    /**
     * Créer un nouvel avis
     */
    private createAvis(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        this.state.update((s) => ({ ...s, submittingAvis: true }));

        const avis: Avis = {
            libele: this.avisForm.get('libele')?.value,
            demandeIndividuelId: demandeId
        };

        this.userService
            .createAvis$(avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Votre avis a été enregistré avec succès'
                    });

                    this.avisForm.reset();
                    this.loadAvis(demandeId);

                    this.state.update((s) => ({
                        ...s,
                        submittingAvis: false,
                        showAvisForm: false
                    }));
                },
                error: (error) => {
                    console.error("Erreur lors de la soumission de l'avis:", error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || "Impossible d'enregistrer votre avis"
                    });
                    this.state.update((s) => ({ ...s, submittingAvis: false }));
                }
            });
    }

    /**
     * Mettre à jour un avis existant
     */
    private updateAvis(): void {
        const avisId = this.state().editingAvisId;
        if (!avisId) return;

        this.state.update((s) => ({ ...s, submittingAvis: true }));

        const avis: Avis = {
            libele: this.avisForm.get('libele')?.value,
            demandeIndividuelId: this.state().demandeIndividuel?.demandeIndividuelId!
        };

        this.userService
            .updateAvis$(avisId, avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Votre avis a été modifié avec succès'
                    });

                    this.cancelEdit();
                    this.loadAvis(this.state().demandeIndividuel?.demandeIndividuelId!);
                },
                error: (error) => {
                    console.error("Erreur lors de la modification de l'avis:", error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || 'Impossible de modifier votre avis'
                    });
                    this.state.update((s) => ({ ...s, submittingAvis: false }));
                }
            });
    }

    /**
     * Entrer en mode édition pour un avis
     */
    editAvis(avis: Avis): void {
        // Vérifier que c'est bien l'avis de l'utilisateur connecté
        if (avis.idUser !== this.state().user?.userId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Non autorisé',
                detail: 'Vous ne pouvez modifier que vos propres avis'
            });
            return;
        }

        this.state.update((s) => ({
            ...s,
            editingAvis: true,
            editingAvisId: avis.avisId,
            showAvisForm: true
        }));

        // Remplir le formulaire avec les données existantes
        this.avisForm.patchValue({
            libele: avis.libele
        });

        // Faire défiler jusqu'au formulaire
        setTimeout(() => {
            const formElement = document.querySelector('.avis-form-section');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 100);
    }

    /**
     * Annuler l'édition
     */
    cancelEdit(): void {
        this.avisForm.reset();
        this.state.update((s) => ({
            ...s,
            editingAvis: false,
            editingAvisId: undefined,
            showAvisForm: !s.userHasAvis,
            submittingAvis: false
        }));
    }

    /**
     * Supprimer un avis avec confirmation
     */
    deleteAvis(avis: Avis): void {
        // Vérifier les permissions
        const isAuthor = avis.idUser === this.state().user?.userId;
        const isAdmin = ['ADMIN', 'MANAGER'].includes(this.state().user?.role || '');

        if (!isAuthor && !isAdmin) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Non autorisé',
                detail: 'Vous ne pouvez pas supprimer cet avis'
            });
            return;
        }

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir supprimer cet avis ? Cette action est irréversible.',
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.performDeleteAvis(avis.avisId!);
            }
        });
    }

    /**
     * Effectuer la suppression de l'avis
     */
    private performDeleteAvis(avisId: number): void {
        this.state.update((s) => ({ ...s, deletingAvisId: avisId }));

        this.userService
            .deleteAvis$(avisId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: "L'avis a été supprimé avec succès"
                    });

                    // Si c'était l'avis de l'utilisateur, réafficher le formulaire
                    if (this.state().currentUserAvis?.avisId === avisId) {
                        this.state.update((s) => ({
                            ...s,
                            userHasAvis: false,
                            currentUserAvis: undefined,
                            showAvisForm: true
                        }));
                    }

                    this.loadAvis(this.state().demandeIndividuel?.demandeIndividuelId!);
                    this.state.update((s) => ({ ...s, deletingAvisId: undefined }));
                },
                error: (error) => {
                    console.error("Erreur lors de la suppression de l'avis:", error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || "Impossible de supprimer l'avis"
                    });
                    this.state.update((s) => ({ ...s, deletingAvisId: undefined }));
                }
            });
    }

    /**
     * Vérifier si l'utilisateur peut éditer un avis
     */
    canEditAvis(avis: Avis): boolean {
        return avis.idUser === this.state().user?.userId;
    }

    /**
     * Vérifier si l'utilisateur peut supprimer un avis
     */
    canDeleteAvis(avis: Avis): boolean {
        const isAuthor = avis.idUser === this.state().user?.userId;
        const isAdmin = ['ADMIN', 'MANAGER'].includes(this.state().user?.role || '');
        return isAuthor || isAdmin;
    }

    /**
     * Obtenir le texte du bouton de soumission
     */
    getSubmitButtonLabel(): string {
        if (this.state().editingAvis) {
            return this.state().submittingAvis ? 'Modification...' : "Modifier l'avis";
        }
        return this.state().submittingAvis ? 'Envoi...' : 'Soumettre mon avis';
    }

    /**
     * Obtenir l'icône du bouton de soumission
     */
    getSubmitButtonIcon(): string {
        return this.state().editingAvis ? 'pi pi-pencil' : 'pi pi-send';
    }

    /**
     * Vérifier si l'utilisateur peut donner un avis
     */
    canGiveAvis(): boolean {
        const userRole = this.state().user?.role;
        const allowedRoles = ['AGENT_CREDIT', 'DR', 'DA', 'MANAGER'];
        return allowedRoles.includes(userRole || '');
    }

    /**
     * Charger les documents séparément si nécessaire
     */
    private loadDocuments(demandeId: number): void {
        this.userService
            .getAllDocuments$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({
                        ...s,
                        documents: response.data.documents || []
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des documents:', error);
                }
            });
    }

    /**
     * Charger les personnes caution pour la consultation DA/DR/MANAGER.
     * Utilise un endpoint dedie qui ne depend pas de la synthese — fonctionne
     * meme pour les petits credits (< 50M) sans bilan d'activite.
     */
    private loadPersonnesCaution(demandeId: number): void {
        this.userService
            .getPersonnesCautionByDemande$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({
                        ...s,
                        personnesCaution: (response.data as any).personnesCaution || []
                    }));
                },
                error: (error) => {
                    console.warn('Pas de personnes caution pour cette demande:', error?.message);
                    // En cas d'erreur, on garde une liste vide — pas bloquant pour l'affichage
                    this.state.update((s) => ({ ...s, personnesCaution: [] }));
                }
            });
    }

    /**
     * Charger les informations du point de vente
     */
    private loadPointVenteInfo(pointventeId: number): void {
        this.userService
            .getPointVenteById$(pointventeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({
                        ...s,
                        pointVente: response.data.pointVente
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement du point de vente:', error);
                }
            });
    }

    private loadPointVentes(agenceId: number): void {
        this.userService
            .getAllPointVenteByAgenceId$(+agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({
                        ...s,
                        pointVentes: response.data.pointVentes
                    }));
                },
                error: (error) => {
                    console.error('Error loading point de ventes:', error);
                }
            });
    }

    onPointVenteChange(event: any): void {
        this.updateForm.get('codAgent')?.reset();
        this.state.update((s) => ({ ...s, agentUsers: [] }));

        const selectedCode = event.value;
        if (!selectedCode) return;

        // Trouver le PointVente sélectionné pour récupérer son id
        const selectedPV = (this.state().pointVentes || []).find((pv) => pv.code === selectedCode);
        if (!selectedPV?.id) return;

        this.userService
            .getUsersByPointVente$(selectedPV.id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const users = response.data?.users || [];
                    this.state.update((s) => ({
                        ...s,
                        agentUsers: users.map((u: any) => ({
                            label: u.username,
                            value: u.username
                        }))
                    }));
                },
                error: (error) => {
                    console.error('Erreur lors du chargement des utilisateurs:', error);
                }
            });
    }
    onSubmit(): void {
        if (this.updateForm.valid) {
            const { statut, codAgent } = this.updateForm.value;
            const demandeIndividuelId = this.state().demandeIndividuel?.demandeIndividuelId;

            if (demandeIndividuelId && codAgent) {
                this.state.update((s) => ({ ...s, loading: true }));

                this.userService
                    .updateDemandeIndividuel$(statut, codAgent.trim().toUpperCase(), +demandeIndividuelId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.state.update((s) => ({
                                ...s,
                                loading: false,
                                message: 'Demande mise à jour avec succès',
                                error: undefined
                            }));

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: 'Sélection effectuée avec succès',
                                life: 3000
                            });

                            setTimeout(() => {
                                this.router.navigate(['/dashboards/credit/individuel/attente']);
                            }, 2000);
                        },
                        error: (error) => {
                            this.state.update((s) => ({
                                ...s,
                                loading: false,
                                error: 'Erreur lors de la mise à jour'
                            }));

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: 'Échec de la mise à jour',
                                life: 3000
                            });
                        }
                    });
            }
        } else {
            this.updateForm.markAllAsTouched();
        }
    }
    // ===============================
    // MÉTHODES POUR LES GARANTIES
    // ===============================

    /**
     * Calculer le total des garanties
     */
    getTotalGaranties(): number {
        const garanties = this.state().demandeIndividuel?.garanties;
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total, g) => total + (g.valeurGarantie || 0), 0);
    }

    /**
     * Calculer la valeur empruntable d'une garantie a la volee selon son type.
     * Garantie Financiere et Autre Garantie => 100% de la valeur
     * Caution Solidaire et Garantie Materielle => 75%
     * Recalcule plutot que de faire confiance a la valeur stockee, qui peut etre
     * obsolete pour les demandes anterieures aux modifications de regles metier.
     */
    getValeurEmprunte(garantie: { typeGarantie?: string; valeurGarantie?: number }): number {
        const valeur = garantie.valeurGarantie || 0;
        const pleineValeur = ['Garantie Financiere', 'Autre Garantie'];
        return pleineValeur.includes(garantie.typeGarantie ?? '') ? valeur : valeur * 0.75;
    }

    /**
     * Calculer le total empruntable
     */
    getTotalEmprunte(): number {
        const garanties = this.state().demandeIndividuel?.garanties;
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total, g) => total + this.getValeurEmprunte(g), 0);
    }

    /**
     * Obtenir la couleur du badge selon le type de garantie
     */
    getGarantieSeverity(type: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        // Example mapping, adjust as needed
        switch (type) {
            case 'CASH':
                return 'success';
            case 'IMMOBILIER':
                return 'info';
            case 'PERSONNEL':
                return 'warn';
            default:
                return 'secondary';
        }
    }

    /**
     * Reconstruit l'URL publique d'un fichier à partir de la valeur stockée en base.
     *
     * Les URLs sont générées côté backend avec ServletUriComponentsBuilder
     * (fromCurrentContextPath), qui déduit le host/scheme/chemin de la requête vue
     * par le microservice. Derrière le reverse proxy de production, cela produit une
     * URL inexploitable par le navigateur : mauvais host (ex. http://localhost:8087),
     * scheme http sur une page https (mixed content), et surtout SANS le préfixe /api
     * requis par le routage public. Les vignettes PDF/fichiers affichent une icône
     * (elles n'ouvrent pas l'URL), mais les <img> échouent silencieusement.
     *
     * On ne conserve donc que le nom de fichier et on rebâtit l'URL sur l'API courante
     * ({apiBaseUrl}/ecredit/files/{fileName}). Cela répare aussi les enregistrements
     * existants sans migration en base.
     */
    getFileUrl(doc?: string | null): string {
        if (!doc) return '';
        // data URL / blob déjà exploitables : ne pas toucher
        if (doc.startsWith('data:') || doc.startsWith('blob:')) return doc;

        // Préserver le segment d'origine (/files/ pour les documents téléversés,
        // /docs/ pour les fichiers pré-embarqués) — les deux sont servis par le backend.
        const match = doc.match(/\/(files|docs)\/(.+)$/i);
        let segment = 'files';
        let fileName: string;
        if (match) {
            segment = match[1].toLowerCase();
            fileName = match[2];
        } else {
            // Fallback : dernier segment du chemin/URL
            fileName = doc.substring(doc.lastIndexOf('/') + 1);
        }
        // Retirer d'éventuels query params / ancres
        fileName = fileName.split('?')[0].split('#')[0];
        if (!fileName) return doc;

        return `${environment.apiBaseUrl}/ecredit/${segment}/${fileName}`;
    }

    // Toutes les autres méthodes existantes restent les mêmes...
    isPDFDocument(doc: Selection): boolean {
        if (!doc.doc) return false;
        return doc.doc.toLowerCase().includes('.pdf');
    }

    isImageDocument(doc: Selection): boolean {
        if (!doc.doc) return false;
        const url = doc.doc.toLowerCase();
        return url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif');
    }

    getDocumentExtension(doc: Selection): string {
        if (!doc.doc) return '';
        const url = doc.doc.toLowerCase();
        if (url.includes('.pdf')) return 'PDF';
        if (url.includes('.png')) return 'PNG';
        if (url.includes('.jpg') || url.includes('.jpeg')) return 'JPG';
        if (url.includes('.gif')) return 'GIF';
        return 'FILE';
    }

    viewDocument(document: Selection): void {
        if (this.isPDFDocument(document)) {
            this.previewSavedPDF(document);
        } else if (this.isImageDocument(document)) {
            this.state.update((s) => ({
                ...s,
                selectedDocumentForPreview: document,
                showPreviewDialog: true
            }));
        }
    }

    previewSavedPDF(document: Selection): void {
        if (!this.isPDFDocument(document)) {
            return;
        }

        const fileUrl = this.getFileUrl(document.doc);

        this.state.update((s) => ({
            ...s,
            selectedPDFDocument: document,
            pdfBlobUrl: fileUrl || null,
            showPDFPreview: true
        }));

        if (fileUrl) {
            window.open(fileUrl, '_blank');
        }
    }

    closePreviewDialog(): void {
        this.state.update((s) => ({
            ...s,
            showPreviewDialog: false,
            selectedDocumentForPreview: null
        }));
    }

    openDocInNewTab(url?: string): void {
        if (url) {
            window.open(url, '_blank');
        }
    }

    closePDFPreview(): void {
        this.state.update((s) => ({
            ...s,
            showPDFPreview: false,
            selectedPDFDocument: null,
            pdfBlobUrl: null
        }));
    }

    openPDFInNewTab(): void {
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
        }
    }

    downloadPDF(): void {
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl) {
            const link = document.createElement('a');
            link.href = pdfUrl;
            link.download = 'document.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    get pdfSafeUrl(): SafeResourceUrl | null {
        const pdfUrl = this.state().pdfBlobUrl;
        if (!pdfUrl) return null;

        if (pdfUrl.startsWith('blob:')) {
            return this.domSanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
        } else {
            const urlWithParams = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
            return this.domSanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
        }
    }

    get showPreviewDialog(): boolean {
        return this.state().showPreviewDialog;
    }

    set showPreviewDialog(value: boolean) {
        this.state.update((s) => ({
            ...s,
            showPreviewDialog: value,
            selectedDocumentForPreview: value ? s.selectedDocumentForPreview : null
        }));
    }

    get showPDFPreview(): boolean {
        return this.state().showPDFPreview;
    }

    set showPDFPreview(value: boolean) {
        if (!value) {
            this.closePDFPreview();
        } else {
            this.state.update((s) => ({ ...s, showPDFPreview: true }));
        }
    }

    get selectedDocumentForPreview(): Selection | null {
        return this.state().selectedDocumentForPreview;
    }

    get selectedPDFDocument(): Selection | null {
        return this.state().selectedPDFDocument;
    }

    ngOnDestroy(): void {
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pdfUrl);
        }
    }

    navigateTo(route: string): void {
        this.router.navigate([route]);
    }

    // nouvelle méthode pour approuver la demande avec confirmation
    approvedDemande(demandeIndividuel: DemandeIndividuel): void {
        console.log('Demande à approuver:', demandeIndividuel);
        const currentUser = this.state().user;
        const codUsuarios = currentUser?.username;

        if (!demandeIndividuel.demandeIndividuelId || !codUsuarios) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'La demande ne peut pas être approuvée: Identifiants manquants'
            });
            return;
        }

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir approuver cette demande?',
            header: "Confirmation d'approbation",
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.state.update((s) => ({ ...s, loading: true }));

                this.userService
                    .updateDemandeIndividuel$('APPROVED', codUsuarios, demandeIndividuel.demandeIndividuelId!)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.state.update((s) => ({
                                ...s,
                                loading: false
                            }));

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Demande approuvée avec succès'
                            });

                            // Wait for 3 seconds before navigating
                            setTimeout(() => {
                                this.router.navigate(['/dashboards/home']);
                            }, 3000);
                        },
                        error: (error) => {
                            this.state.update((s) => ({ ...s, loading: false, error: error.message || String(error) }));
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Failed',
                                detail: error.message || "Erreur lors de l'approbation"
                            });
                        }
                    });
            },
            reject: () => {
                // Optional: Add a message to indicate the action was cancelled
                this.messageService.add({
                    severity: 'info',
                    summary: 'Annulé',
                    detail: "Vous avez annulé l'approbation"
                });
            }
        });
    }

    /**
     * Rejeter la demande (réservé au DA)
     */
    rejectDemande(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;

        if (!demandeId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID de la demande non trouvé'
            });
            return;
        }

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir rejeter cette demande ? Cette action est définitive.',
            header: 'Confirmation de rejet',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Rejeter',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            accept: () => {
                this.state.update((s) => ({ ...s, loading: true }));

                this.userService
                    .rejectDemandeIndividuel$(demandeId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.state.update((s) => ({ ...s, loading: false }));

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: 'La demande a été rejetée avec succès',
                                life: 3000
                            });

                            // Redirection après 2 secondes
                            setTimeout(() => {
                                this.router.navigate(['/dashboards/home']);
                            }, 2000);
                        },
                        error: (error) => {
                            this.state.update((s) => ({
                                ...s,
                                loading: false,
                                error: error.error?.message || 'Erreur lors du rejet de la demande'
                            }));

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: error.error?.message || 'Impossible de rejeter la demande',
                                life: 5000
                            });
                        }
                    });
            }
        });
    }

    /**
     * Imprimer le dossier complet de la demande
     */
    imprimerDossierComplet(): void {
        const demande = this.state().demandeIndividuel;
        if (!demande) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Aucune demande à imprimer'
            });
            return;
        }

        const printWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!printWindow) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'ouvrir la fenêtre d'impression"
            });
            return;
        }

        const htmlContent = this.genererHTMLDossierComplet();
        printWindow.document.write(htmlContent);
        printWindow.document.close();

        // Attendre le chargement puis imprimer
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.print();
            }, 500);
        };
    }

    /**
     * Prévisualiser le dossier avant impression
     */
    previsualiserDossier(): void {
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        if (!previewWindow) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible d'ouvrir la fenêtre de prévisualisation"
            });
            return;
        }

        const htmlContent = this.genererHTMLDossierComplet(true);
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
    }

    /**
     * Exporter le dossier en PDF
     */
    exporterPDF(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: 'Choisissez "Enregistrer en PDF" dans la fenêtre d\'impression'
        });

        setTimeout(() => {
            this.imprimerDossierComplet();
        }, 1000);
    }

    /**
     * Obtenir le libellé de la nature du client
     */
    /** Nature Fonctionnaire : l'analyse bilan/flux est remplacée par l'analyse charges & quotité. */
    isFonctionnaireNature(): boolean {
        return this.state().demandeIndividuel?.natureClient === 'Demande de credit Pour Fonctionnaire';
    }

    // ==================== TRANSFORMATION EN CREDIT FONCTIONNAIRE ====================
    // Requalification des crédits accordés à des fonctionnaires AVANT l'intégration
    // du crédit fonctionnaire dans l'application (nature Particulier à l'époque).

    typeContratOptionsFonctionnaire = TYPE_CONTRAT_OPTIONS_FONCTIONNAIRE;
    transformationFonctionnaire: DemandeFonctionnaire = demandeFonctionnaireVide();

    peutTransformerEnFonctionnaire(): boolean {
        const role = this.state().user?.role;
        return !this.isFonctionnaireNature() && !!this.state().demandeIndividuel
            && (role === 'AGENT_CREDIT' || role === 'DA' || role === 'SUPER_ADMIN');
    }

    ouvrirTransformationFonctionnaire(): void {
        this.transformationFonctionnaire = demandeFonctionnaireVide();
        this.state.update(this.mergeState({ showTransformationFonctionnaire: true }));
    }

    confirmerTransformationFonctionnaire(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;
        const ext = this.transformationFonctionnaire;
        if (!ext.serviceEmployeur?.trim() || !ext.departementMinistere?.trim() || !ext.typeContrat) {
            this.messageService.add({ severity: 'warn', summary: 'Champs obligatoires', detail: 'Service employeur, département/ministère et type de contrat sont obligatoires', life: 5000 });
            return;
        }
        if (!ext.salaireNetMensuel || ext.salaireNetMensuel <= 0) {
            this.messageService.add({ severity: 'warn', summary: 'Salaire requis', detail: 'Le salaire net mensuel doit être supérieur à 0', life: 5000 });
            return;
        }
        if (!ext.domiciliationSalaire) {
            this.messageService.add({ severity: 'warn', summary: 'Domiciliation requise', detail: 'La domiciliation du salaire au CRG est obligatoire pour un crédit fonctionnaire', life: 6000 });
            return;
        }
        this.state.update(this.mergeState({ transformationEnCours: true }));
        this.userService
            .transformerEnFonctionnaire$(+demandeId, ext)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Transformation effectuée',
                        detail: 'La demande est désormais un crédit fonctionnaire (quotité 35 %, analyse charges)',
                        life: 6000
                    });
                    this.state.update(this.mergeState({ showTransformationFonctionnaire: false, transformationEnCours: false }));
                    this.loadDemandeWithGaranties();
                },
                error: (err: any) => {
                    this.state.update(this.mergeState({ transformationEnCours: false }));
                    this.messageService.add({ severity: 'error', summary: 'Transformation refusée', detail: err || 'Échec de la transformation', life: 8000 });
                }
            });
    }

    /** Libellés des 12 postes de charges, dans l'ordre de la grille de saisie de l'agent. */
    readonly postesChargesFonctionnaire: { key: keyof AnalyseChargesFonctionnaire; libelle: string }[] = [
        { key: 'chargeLoyer', libelle: 'Loyer' },
        { key: 'chargeTransport', libelle: 'Transport' },
        { key: 'chargeNourriture', libelle: 'Nourriture' },
        { key: 'chargeVignette', libelle: 'Vignette' },
        { key: 'chargeAssurance', libelle: 'Assurance' },
        { key: 'chargeElectricite', libelle: 'Électricité' },
        { key: 'chargeEau', libelle: 'Eau' },
        { key: 'chargeAssuranceMaladie', libelle: 'Assurance maladie' },
        { key: 'chargeScolarite', libelle: 'Scolarité' },
        { key: 'chargeCasSociaux', libelle: 'Cas sociaux' },
        { key: 'chargeAbonnementImage', libelle: 'Abonnement image (TV)' },
        { key: 'chargeServiceSalubrite', libelle: 'Service salubrité' }
    ];

    montantChargeFonctionnaire(key: keyof AnalyseChargesFonctionnaire): number {
        const analyse = this.state().analyseChargesFonctionnaire;
        return analyse ? Number(analyse[key]) || 0 : 0;
    }

    private loadAnalyseChargesFonctionnaire(demandeId: number): void {
        this.userService
            .getAnalyseChargesFonctionnaire$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => this.state.update((s) => ({ ...s, analyseChargesFonctionnaire: response.data?.analyseCharges || null })),
                error: () => this.state.update((s) => ({ ...s, analyseChargesFonctionnaire: null }))
            });
        this.userService
            .getPiecesDemande$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => this.state.update((s) => ({ ...s, piecesFonctionnaire: response.data?.pieces || [] })),
                error: () => this.state.update((s) => ({ ...s, piecesFonctionnaire: [] }))
            });
    }

    libelleTypePieceFonctionnaire(type?: string): string {
        switch (type) {
            case 'BULLETIN_SALAIRE':
                return 'Bulletin de salaire';
            case 'ATTESTATION_SERVICE':
                return 'Attestation de service';
            case 'AUTRE':
                return 'Autre pièce';
            default:
                return type || 'Pièce';
        }
    }

    /** Échappe le texte libre injecté dans le HTML imprimable (avis, service, matricule...). */
    private escapeHtml(value?: string | null): string {
        if (!value) return '';
        return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    /** Section imprimable du dossier fonctionnaire : emploi, salaire, quotité et grille des charges. */
    private genererSectionFonctionnaire(): string {
        const demande = this.state().demandeIndividuel;
        const fct = demande?.demandeFonctionnaire;
        if (!this.isFonctionnaireNature() || !fct) return '';

        const fmt = (montant?: number | null) => (montant != null ? Number(montant).toLocaleString('fr-FR') + ' GNF' : 'N/A');
        const esc = (texte?: string | null) => this.escapeHtml(texte) || 'N/A';
        const quotite = fct.quotiteCessible != null ? fct.quotiteCessible : quotiteCessibleFonctionnaire(fct.salaireNetMensuel);
        const analyse = this.state().analyseChargesFonctionnaire;

        const lignesCharges: [string, number | undefined][] = analyse
            ? [
                  ['Loyer', analyse.chargeLoyer],
                  ['Transport', analyse.chargeTransport],
                  ['Nourriture', analyse.chargeNourriture],
                  ['Vignette', analyse.chargeVignette],
                  ['Assurance', analyse.chargeAssurance],
                  ['Électricité', analyse.chargeElectricite],
                  ['Eau', analyse.chargeEau],
                  ['Assurance maladie', analyse.chargeAssuranceMaladie],
                  ['Scolarité', analyse.chargeScolarite],
                  ['Cas sociaux', analyse.chargeCasSociaux],
                  ['Abonnement image', analyse.chargeAbonnementImage],
                  ['Service salubrité', analyse.chargeServiceSalubrite]
              ]
            : [];

        return `
                <!-- Section Fonctionnaire -->
                <div class="section">
                    <h2>SITUATION PROFESSIONNELLE DU FONCTIONNAIRE</h2>
                    <table class="info-table">
                        <tr>
                            <td class="label">Service employeur:</td>
                            <td class="value">${esc(fct.serviceEmployeur)}</td>
                            <td class="label">Département / Ministère:</td>
                            <td class="value">${esc(fct.departementMinistere)}</td>
                        </tr>
                        <tr>
                            <td class="label">Type de contrat:</td>
                            <td class="value">${esc(fct.typeContrat)}</td>
                            <td class="label">Matricule / Ancienneté:</td>
                            <td class="value">${esc(fct.matricule)} / ${fct.ancienneteAnnees != null ? fct.ancienneteAnnees + ' an(s)' : 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Salaire net mensuel:</td>
                            <td class="value">${fmt(fct.salaireNetMensuel)}</td>
                            <td class="label">Autres revenus:</td>
                            <td class="value">${fmt(fct.autresRevenus)}</td>
                        </tr>
                        <tr>
                            <td class="label">Quotité cessible (35 %):</td>
                            <td class="value"><strong>${fmt(quotite)}</strong></td>
                            <td class="label">Domiciliation du salaire au CRG:</td>
                            <td class="value">${fct.domiciliationSalaire ? 'OUI (engagement signé)' : 'NON'}</td>
                        </tr>
                    </table>
                    ${
                        analyse
                            ? `
                    <h2 style="margin-top:16px">ANALYSE CHARGES &amp; QUOTITÉ</h2>
                    <table class="info-table">
                        ${lignesCharges
                            .reduce<string[]>((rows, [libelle, montant], index) => {
                                if (index % 2 === 0) {
                                    rows.push(`<tr><td class="label">${libelle}:</td><td class="value">${fmt(montant)}</td>`);
                                } else {
                                    rows[rows.length - 1] += `<td class="label">${libelle}:</td><td class="value">${fmt(montant)}</td></tr>`;
                                }
                                return rows;
                            }, [])
                            .join('')}
                        <tr>
                            <td class="label">Total des charges:</td>
                            <td class="value"><strong>${fmt(analyse.totalCharges)}</strong></td>
                            <td class="label">Capacité résiduelle:</td>
                            <td class="value"><strong>${fmt(analyse.capaciteResiduelle)}</strong></td>
                        </tr>
                        <tr>
                            <td class="label">Verdict:</td>
                            <td class="value"><strong>${analyse.verdict === 'FINANCABLE' ? 'DOSSIER FINANÇABLE' : 'NON FINANÇABLE'}</strong></td>
                            <td class="label">Analysé par:</td>
                            <td class="value">${esc(analyse.analysePar)}</td>
                        </tr>
                        ${analyse.avisAgent ? `<tr><td class="label">Avis de l'agent:</td><td class="value" colspan="3">${this.escapeHtml(analyse.avisAgent)}</td></tr>` : ''}
                    </table>
                    `
                            : ''
                    }
                </div>
        `;
    }

    getNatureClientLabel(natureClient?: string): string {
        if (!natureClient) return 'Particulier';
        if (natureClient.includes('PME')) return 'Entreprise (PME/PMI)';
        if (natureClient.includes('Professionnel')) return 'Professionnel';
        if (natureClient.includes('Fonctionnaire')) return 'Fonctionnaire';
        return 'Particulier';
    }

    /**
     * Générer le HTML complet du dossier
     */
    private genererHTMLDossierComplet(isPreview: boolean = false): string {
        const demande = this.state().demandeIndividuel;
        const dateImpression = new Date().toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const natureClientLabel = this.getNatureClientLabel(demande?.natureClient);

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="utf-8">
            <title>Demande de Crédit - ${demande?.nom} ${demande?.prenom}</title>
            <style>
                ${this.getStylesImpression()}
            </style>
        </head>
        <body>
            <div class="print-container">
                ${isPreview ? this.genererBoutonsPreview() : ''}

                <!-- En-tête du document -->
                <div class="header">
                    <h1>DEMANDE DE CRÉDIT - ${natureClientLabel.toUpperCase()}</h1>
                    <div class="header-info">
                        <div>
                            <strong>N° Dossier:</strong> ${demande?.demandeIndividuelId}<br>
                            <strong>Date de demande:</strong> ${this.formatDateForPrint(demande?.createdAt)}<br>
                            <strong>Date d'impression:</strong> ${dateImpression}
                        </div>
                        <div>
                            <strong>Nature du client:</strong> ${natureClientLabel}<br>
                            <strong>Agence:</strong> ${this.state().pointVente?.libele || 'Non assigné'}<br>
                            <strong>Statut:</strong> ${demande?.statutDemande}
                        </div>
                    </div>
                </div>

                ${
                    demande?.natureClient?.includes('PME') && demande?.nomPersonneMorale
                        ? `
                <!-- Section Entreprise (PME) -->
                <div class="section pme-section">
                    <h2>INFORMATIONS ENTREPRISE</h2>
                    <table class="info-table">
                        <tr>
                            <td class="label">Raison sociale:</td>
                            <td class="value">${demande.nomPersonneMorale}</td>
                            <td class="label">Sigle:</td>
                            <td class="value">${demande.sigle || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Catégorie:</td>
                            <td class="value">${demande.categorie || 'N/A'}</td>
                            <td class="label">Titre du Directeur:</td>
                            <td class="value">${demande.titreDirecteur || 'N/A'}</td>
                        </tr>
                    </table>
                </div>
                `
                        : ''
                }

                ${this.genererSectionFonctionnaire()}

                <!-- Section 1: Informations sur le membre/client -->
                <div class="section">
                    <h2>1. INFORMATIONS SUR LE MEMBRE/CLIENT</h2>
                    <table class="info-table">
                        <tr>
                            <td class="label">Nom et Prénoms:</td>
                            <td class="value">${demande?.nom} ${demande?.prenom}</td>
                            <td class="label">Numéro membre:</td>
                            <td class="value">${demande?.numeroMembre}</td>
                        </tr>
                        <tr>
                            <td class="label">Type de pièce:</td>
                            <td class="value">${demande?.typePiece}</td>
                            <td class="label">Référence:</td>
                            <td class="value">${demande?.numId}</td>
                        </tr>
                        <tr>
                            <td class="label">Date de naissance:</td>
                            <td class="value">${this.formatDateForPrint(demande?.dateNaissance)}</td>
                            <td class="label">Lieu de naissance:</td>
                            <td class="value">${demande?.lieuxNaissance}</td>
                        </tr>
                        <tr>
                            <td class="label">Genre:</td>
                            <td class="value">${demande?.genre}</td>
                            <td class="label">Situation matrimoniale:</td>
                            <td class="value">${demande?.situationMatrimoniale}</td>
                        </tr>
                        <tr>
                            <td class="label">Personnes à charge:</td>
                            <td class="value">${demande?.nombrePersonneEnCharge}</td>
                            <td class="label">Enfants scolarisés:</td>
                            <td class="value">${demande?.nombrePersonneScolarise}</td>
                        </tr>
                        ${
                            demande?.nomPere || demande?.nomMere
                                ? `
                        <tr>
                            <td class="label">Nom du père:</td>
                            <td class="value">${demande?.nomPere || 'Non renseigné'}</td>
                            <td class="label">Nom de la mère:</td>
                            <td class="value">${demande?.nomMere || 'Non renseigné'}</td>
                        </tr>
                        `
                                : ''
                        }
                        ${
                            demande?.nomConjoint
                                ? `
                        <tr>
                            <td class="label">Nom du conjoint:</td>
                            <td class="value" colspan="3">${demande?.nomConjoint}</td>
                        </tr>
                        `
                                : ''
                        }
                        <tr>
                            <td class="label">Adresse:</td>
                            <td class="value" colspan="3">${demande?.addresseDomicileContact}</td>
                        </tr>
                        ${
                            demande?.email
                                ? `
                        <tr>
                            <td class="label">Email:</td>
                            <td class="value">${demande?.email}</td>
                            <td class="label">Téléphone:</td>
                            <td class="value">${demande?.telephone}</td>
                        </tr>
                        `
                                : ''
                        }
                        <tr>
                            <td class="label">Préfecture:</td>
                            <td class="value">${demande?.prefecture || 'N/A'}</td>
                            <td class="label">Sous-Préfecture:</td>
                            <td class="value">${demande?.sousPrefecture || 'N/A'}</td>
                        </tr>
                        <tr>
                            <td class="label">Années à l'adresse:</td>
                            <td class="value">${demande?.nombreAnneeHabitation} ans</td>
                            <td class="label">Type de propriété:</td>
                            <td class="value">${demande?.typePropriete}</td>
                        </tr>
                    </table>
                </div>

                <!-- Section 2: Activités -->
                <div class="section">
                    <h2>2. ACTIVITÉS</h2>
                    <table class="info-table">
                        <tr>
                            <td class="label">Type d'activité:</td>
                            <td class="value">${demande?.currentActivite}</td>
                            <td class="label">Sous-activité:</td>
                            <td class="value">${demande?.descriptionActivite}</td>
                        </tr>
                        <tr>
                            <td class="label">Description:</td>
                            <td class="value" colspan="3">${demande?.descriptionActivite}</td>
                        </tr>
                        <tr>
                            <td class="label">Années d'activité:</td>
                            <td class="value">${demande?.nombreAnneeActivite} ans</td>
                            <td class="label">Adresse du lieu:</td>
                            <td class="value">${demande?.adresseLieuActivite}</td>
                        </tr>
                        <tr>
                            <td class="label">Autres activités:</td>
                            <td class="value">${demande?.autreActivite || 'Aucune'}</td>
                            <td class="label">Lieu d'activité:</td>
                            <td class="value">${demande?.lieuActivite || 'N/A'}</td>
                        </tr>
                    </table>
                </div>

                <!-- Section 3: Modalités de la demande -->
                <div class="section">
                    <h2>3. MODALITÉS DE LA DEMANDE</h2>
                    <table class="info-table">
                        <tr>
                            <td class="label">Montant demandé:</td>
                            <td class="value highlight">${this.formatCurrency(demande?.montantDemande)}</td>
                            <td class="label">Durée:</td>
                            <td class="value">${demande?.dureeDemande} Mois</td>
                        </tr>
                        <tr>
                            <td class="label">Périodicité:</td>
                            <td class="value">${demande?.periodiciteRemboursement}</td>
                            <td class="label">Taux d'intérêt:</td>
                            <td class="value">${demande?.tauxInteret}%</td>
                        </tr>
                        <tr>
                            <td class="label">Période de différé:</td>
                            <td class="value">${demande?.periodeDiffere} Mois</td>
                            <td class="label">Nombre d'échéances:</td>
                            <td class="value">${demande?.nombreEcheance}</td>
                        </tr>
                        <tr>
                            <td class="label">Échéance:</td>
                            <td class="value highlight">${this.formatCurrency(demande?.echeance)}</td>
                            <td class="label">Objet du crédit:</td>
                            <td class="value">${demande?.objectCredit}</td>
                        </tr>
                        <tr>
                            <td class="label">Détail de l'objet:</td>
                            <td class="value" colspan="3">${demande?.detailObjectCredit}</td>
                        </tr>
                        <tr>
                            <td class="label">Type de crédit:</td>
                            <td class="value">${demande?.statutCredit}</td>
                            <td class="label">Rang de crédit:</td>
                            <td class="value">${demande?.rangCredit}</td>
                        </tr>
                    </table>
                </div>

                <!-- Section 4: Garanties -->
                <div class="section">
                    <h2>4. GARANTIES PROPOSÉES</h2>
                    <table class="garanties-table">
                        <thead>
                            <tr>
                                <th>Type de Garantie</th>
                                <th>Nature/Description</th>
                                <th>Valeur de la garantie</th>
                                <th>Valeur d'emprunt</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.genererLignesGaranties()}
                        </tbody>
                        <tfoot>
                            <tr class="total-row">
                                <td colspan="2">TOTAL</td>
                                <td>${this.formatCurrency(this.getTotalGaranties())}</td>
                                <td>${this.formatCurrency(this.getTotalEmprunte())}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                <!-- Section 5: Avis (si disponibles) -->
                ${this.genererSectionAvis()}

                <!-- Pied de page -->
                <div class="footer">
                    <div class="signatures">
                        <div class="signature-box">
                            <p>Signature du demandeur</p>
                            <div class="signature-line"></div>
                        </div>
                        <div class="signature-box">
                            <p>Signature de l'agent</p>
                            <div class="signature-line"></div>
                        </div>
                        <div class="signature-box">
                            <p>Signature du responsable</p>
                            <div class="signature-line"></div>
                        </div>
                    </div>
                    <div class="footer-info">
                        <p>Document généré le ${dateImpression}</p>
                        <p>Page <span class="page-number"></span></p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
    }

    /**
     * Générer les lignes de garanties pour l'impression
     */
    private genererLignesGaranties(): string {
        const garanties = this.state().demandeIndividuel?.garanties || [];

        if (garanties.length === 0) {
            return '<tr><td colspan="4" class="text-center">Aucune garantie proposée</td></tr>';
        }

        return garanties
            .map(
                (g) => `
        <tr>
            <td>${g.typeGarantie}</td>
            <td>${g.descriptionGarantie}</td>
            <td class="text-right">${this.formatCurrency(g.valeurGarantie)}</td>
            <td class="text-right">${this.formatCurrency(this.getValeurEmprunte(g))}</td>
        </tr>
    `
            )
            .join('');
    }

    /**
     * Générer la section des avis pour l'impression
     */
    private genererSectionAvis(): string {
        const avisList = this.state().avisList || [];

        if (avisList.length === 0) {
            return '';
        }

        return `
        <div class="section">
            <h2>5. AVIS ET RECOMMANDATIONS</h2>
            ${avisList
                .map(
                    (avis) => `
                <div class="avis-item">
                    <div class="avis-header">
                        <strong>${avis.userFullName || 'Utilisateur'}</strong>
                        <span>${this.formatDate(avis.dateCreation)}</span>
                    </div>
                    <div class="avis-content">
                        ${avis.libele}
                    </div>
                </div>
            `
                )
                .join('')}
        </div>
    `;
    }

    /**
     * Générer les boutons de prévisualisation
     */
    private genererBoutonsPreview(): string {
        return `
        <div class="preview-controls">
            <button onclick="window.print()" class="btn-print">
                Imprimer
            </button>
            <button onclick="window.close()" class="btn-close">
                Fermer
            </button>
        </div>
    `;
    }

    /**
     * Formater la date pour l'impression
     */
    private formatDateForPrint(date: Date | string | undefined): string {
        if (!date) return 'N/A';

        const d = new Date(date);
        if (isNaN(d.getTime())) return 'N/A';

        return d.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    /**
     * Formater la monnaie pour l'impression
     */
    private formatCurrency(amount: number | undefined): string {
        if (!amount) return '0 GNF';

        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Obtenir les styles CSS pour l'impression
     */
    private getStylesImpression(): string {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            line-height: 1.5;
            color: #333;
        }

        .print-container {
            max-width: 210mm;
            margin: 0 auto;
            padding: 10mm;
        }

        .preview-controls {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #333;
            padding: 10px;
            text-align: center;
            z-index: 1000;

            @media print {
                display: none;
            }
        }

        .preview-controls button {
            margin: 0 10px;
            padding: 8px 20px;
            font-size: 14px;
            cursor: pointer;
            border: none;
            border-radius: 4px;
        }

        .btn-print {
            background: #28a745;
            color: white;
        }

        .btn-close {
            background: #6c757d;
            color: white;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 3px solid #333;
        }

        .header h1 {
            font-size: 20px;
            margin-bottom: 15px;
            text-transform: uppercase;
        }

        .header-info {
            display: flex;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 11px;
        }

        .section {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }

        .section h2 {
            background: #f0f0f0;
            padding: 8px;
            font-size: 14px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
        }

        .pme-section {
            border: 2px solid #7c3aed;
            border-radius: 8px;
            margin-bottom: 20px;
        }

        .pme-section h2 {
            background: #7c3aed;
            color: white;
            border: none;
            border-radius: 6px 6px 0 0;
        }

        .info-table {
            width: 100%;
            border-collapse: collapse;
        }

        .info-table td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .info-table .label {
            background: #f8f9fa;
            font-weight: bold;
            width: 25%;
        }

        .info-table .value {
            width: 25%;
        }

        .info-table .highlight {
            background: #fff3cd;
            font-weight: bold;
        }

        .garanties-table {
            width: 100%;
            border-collapse: collapse;
        }

        .garanties-table th {
            background: #333;
            color: white;
            padding: 8px;
            text-align: left;
            border: 1px solid #333;
        }

        .garanties-table td {
            padding: 6px;
            border: 1px solid #ddd;
        }

        .garanties-table .total-row {
            background: #f0f0f0;
            font-weight: bold;
        }

        .garanties-table .text-right {
            text-align: right;
        }

        .garanties-table .text-center {
            text-align: center;
        }

        .avis-item {
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 4px;
        }

        .avis-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eee;
        }

        .avis-content {
            white-space: pre-wrap;
            line-height: 1.6;
        }

        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #333;
        }

        .signatures {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
        }

        .signature-box {
            width: 30%;
            text-align: center;
        }

        .signature-line {
            margin-top: 50px;
            border-bottom: 1px solid #333;
        }

        .footer-info {
            text-align: center;
            font-size: 10px;
            color: #666;
        }

        @media print {
            body {
                margin: 0;
            }

            .print-container {
                padding: 5mm;
            }

            .section {
                page-break-inside: avoid;
            }

            @page {
                margin: 10mm;
                size: A4;
            }

            .page-number:after {
                content: counter(page);
            }
        }
    `;
    }

    /**
     * Ouvrir une route dans un nouvel onglet
     */
    openInNewTab(route: string): void {
        window.open(route, '_blank');
    }

    // ==================== VALIDATION DA ====================

    private loadValidationDA(demandeId: number): void {
        this.userService
            .getStatutValidationDA$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const validations = (response.data as any)?.validationsDA || [];
                    let bilan: any = null;
                    let flux: any = null;
                    for (const v of validations) {
                        if (v.typeValidation === 'BILAN_ACTIVITE') {
                            bilan = v;
                        } else if (v.typeValidation === 'FLUX_TRESORERIE') {
                            flux = v;
                        }
                    }
                    // Parse sectionsARevoir from comma-separated string to array
                    if (bilan?.sectionsARevoir && typeof bilan.sectionsARevoir === 'string') {
                        bilan = { ...bilan, sectionsARevoir: bilan.sectionsARevoir.split(',').map((s: string) => s.trim()) };
                    }
                    if (flux?.sectionsARevoir && typeof flux.sectionsARevoir === 'string') {
                        flux = { ...flux, sectionsARevoir: flux.sectionsARevoir.split(',').map((s: string) => s.trim()) };
                    }
                    this.state.update((s) => ({
                        ...s,
                        validationDA: { bilan, flux }
                    }));
                },
                error: () => {
                    // Pas de validation encore, on reste avec null
                }
            });
    }

    validerBilan(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        this.confirmationService.confirm({
            message: "Confirmez-vous la validation du Bilan d'Activité ?",
            header: 'Confirmation',
            icon: 'pi pi-check-circle',
            accept: () => {
                this.userService
                    .validerBilanDA$(+demandeId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Succès', detail: "Bilan d'activité validé", life: 3000 });
                            this.loadValidationDA(+demandeId);
                        },
                        error: (err) => {
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Erreur lors de la validation', life: 5000 });
                        }
                    });
            }
        });
    }

    ouvrirModalRejetBilan(): void {
        this.rejetBilanForm.reset();
        this.state.update((s) => ({ ...s, showModalRejetBilan: true }));
    }

    confirmerRejetBilan(): void {
        if (this.rejetBilanForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        const body = {
            motifRejet: this.rejetBilanForm.value.motifRejet,
            sectionsARevoir: this.rejetBilanForm.value.sectionsARevoir,
            instructionsAc: this.rejetBilanForm.value.instructionsAc || null
        };

        this.userService
            .rejeterBilanDA$(+demandeId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: "Bilan d'activité rejeté", life: 3000 });
                    this.state.update((s) => ({ ...s, showModalRejetBilan: false }));
                    this.loadValidationDA(+demandeId);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }

    validerFlux(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        this.confirmationService.confirm({
            message: 'Confirmez-vous la validation du Flux de Trésorerie ?',
            header: 'Confirmation',
            icon: 'pi pi-check-circle',
            accept: () => {
                this.userService
                    .validerFluxDA$(+demandeId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: () => {
                            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Flux de trésorerie validé', life: 3000 });
                            this.loadValidationDA(+demandeId);
                        },
                        error: (err) => {
                            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Erreur lors de la validation', life: 5000 });
                        }
                    });
            }
        });
    }

    ouvrirModalRejetFlux(): void {
        this.rejetFluxForm.reset();
        this.state.update((s) => ({ ...s, showModalRejetFlux: true }));
    }

    confirmerRejetFlux(): void {
        if (this.rejetFluxForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        const body = {
            motifRejet: this.rejetFluxForm.value.motifRejet,
            sectionsARevoir: this.rejetFluxForm.value.sectionsARevoir,
            instructionsAc: this.rejetFluxForm.value.instructionsAc || null
        };

        this.userService
            .rejeterFluxDA$(+demandeId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: 'Flux de trésorerie rejeté', life: 3000 });
                    this.state.update((s) => ({ ...s, showModalRejetFlux: false }));
                    this.loadValidationDA(+demandeId);
                },
                error: (err) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }

    toggleSection(form: FormGroup, value: string, event: Event): void {
        const checkbox = event.target as HTMLInputElement;
        const current: string[] = form.get('sectionsARevoir')?.value || [];
        if (checkbox.checked) {
            form.get('sectionsARevoir')?.setValue([...current, value]);
        } else {
            form.get('sectionsARevoir')?.setValue(current.filter((v) => v !== value));
        }
        form.get('sectionsARevoir')?.markAsTouched();
    }

    mergeState(partial: any): (s: any) => any {
        return (s: any) => ({ ...s, ...partial });
    }

    getSectionLabel(value: string): string {
        const all = [...this.sectionsBilanOptions, ...this.sectionsFluxOptions, ...this.workflowSectionsOptions, ...this.workflowSectionsOptionsFonctionnaire];
        return all.find((o) => o.value === value)?.label || value;
    }

    goBack(): void {
        const role = this.state().user?.role;
        if (role === 'DA') {
            this.router.navigate(['/dashboards']);
        } else if (role === 'DR') {
            this.router.navigate(['/dashboards']);
        } else if (role === 'MANAGER') {
            this.router.navigate(['/dashboards']);
        } else {
            this.router.navigate(['/dashboards/agent-credit/list-selection-ind']);
        }
    }

    // ==================== WORKFLOW HIERARCHIQUE ====================

    /** Niveau dont la validation est finale pour le montant de la demande (échelle de délégation). */
    niveauFinal(): NiveauValidationFinale {
        return niveauValidationFinale(this.state().demandeIndividuel?.montantDemande);
    }

    libelleNiveauFinal(): string {
        return libelleNiveauValidation(this.niveauFinal());
    }

    /** Le DA est le validateur final (montant <= 25 000 000 GNF). */
    isValidationFinaleDA(): boolean {
        return this.niveauFinal() === 'DA';
    }

    /** Le DR est le validateur final (montant <= 50 000 000 GNF). */
    isValidationFinaleDR(): boolean {
        return this.niveauFinal() === 'DR';
    }

    getWorkflowSteps(): { label: string; state: string; active: boolean; completed: boolean }[] {
        const vs = this.state().demandeIndividuel?.validationState || '';
        const stateOrder = ['NOUVEAU', 'SELECTION', 'APPROVED', 'VALIDATED_DA', 'VALIDATED_DR', 'VALIDATED_FINAL'];
        const correctionStates: Record<string, string> = {
            CORRECTION: 'APPROVED',
            CORRECTION_DR: 'VALIDATED_DA',
            CORRECTION_DE: 'VALIDATED_DR'
        };
        const effectiveState = correctionStates[vs] || vs;
        const currentIdx = stateOrder.indexOf(effectiveState);
        const niveau = this.niveauFinal();

        const steps = [
            { label: 'Demande', state: 'NOUVEAU', active: effectiveState === 'NOUVEAU', completed: currentIdx > 0 },
            { label: 'Selection', state: 'SELECTION', active: effectiveState === 'SELECTION', completed: currentIdx > 1 },
            { label: 'AC Approuve', state: 'APPROVED', active: effectiveState === 'APPROVED', completed: currentIdx > 2 }
        ];
        // Échelle de délégation : on n'affiche que les maillons traversés pour ce montant
        if (niveau !== 'DA') {
            steps.push({ label: 'DA Valide', state: 'VALIDATED_DA', active: effectiveState === 'VALIDATED_DA', completed: currentIdx > 3 });
        }
        if (niveau === 'DE' || niveau === 'DG') {
            steps.push({ label: 'DR Valide', state: 'VALIDATED_DR', active: effectiveState === 'VALIDATED_DR', completed: currentIdx > 4 });
        }
        steps.push({ label: `Valide Final (${niveau})`, state: 'VALIDATED_FINAL', active: effectiveState === 'VALIDATED_FINAL', completed: false });
        return steps;
    }

    isInCorrectionState(): boolean {
        const vs = this.state().demandeIndividuel?.validationState || '';
        return ['CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE'].includes(vs);
    }

    /**
     * Seuil au-dela duquel un Bilan d'Activite est obligatoire (50 000 000 GNF).
     * En dessous, seuls Flux de Tresorerie + Personnes Caution + Documents sont requis.
     */
    static readonly SEUIL_BILAN_GNF = 50_000_000;

    /**
     * Determine si le Bilan d'Activite doit etre affiche/rempli pour cette demande,
     * en fonction du montant sollicite.
     */
    isBilanRequired(): boolean {
        const montant = this.state().demandeIndividuel?.montantDemande;
        if (montant == null) return true; // par defaut, on l'affiche si on ne sait pas
        return Number(montant) >= DetailComponent.SEUIL_BILAN_GNF;
    }

    /**
     * Check if bilan needs correction (old validation_da rejection OR new workflow DA/DR/DE rejection)
     */
    isBilanNeedsCorrection(): boolean {
        if (this.state().validationDA.bilan?.statut === 'REJETE') return true;
        const vs = this.state().demandeIndividuel?.validationState || '';
        const bilanSections = ['BILAN_ACTIVITE', 'COLLECTE', 'AMORTISSEMENTS', 'RENTABILITE', 'RATIOS', 'PERSONNE_CAUTION'];
        if (vs === 'CORRECTION') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDa || '';
            return bilanSections.some((s) => sections.includes(s));
        }
        if (vs === 'CORRECTION_DR') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDr || '';
            return bilanSections.some((s) => sections.includes(s));
        }
        if (vs === 'CORRECTION_DE') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDe || '';
            return bilanSections.some((s) => sections.includes(s));
        }
        return false;
    }

    isDemandeCompleteNeedsCorrection(): boolean {
        const vs = this.state().demandeIndividuel?.validationState || '';
        const demandeSections = ['DEMANDE_COMPLETE', 'COLLECTE'];
        const getSections = (s: string | undefined) => demandeSections.some((d) => (s || '').includes(d));
        if (vs === 'CORRECTION') return getSections(this.state().demandeIndividuel?.sectionsARevoirDa);
        if (vs === 'CORRECTION_DR') return getSections(this.state().demandeIndividuel?.sectionsARevoirDr);
        if (vs === 'CORRECTION_DE') return getSections(this.state().demandeIndividuel?.sectionsARevoirDe);
        return false;
    }

    isFluxNeedsCorrection(): boolean {
        if (this.state().validationDA.flux?.statut === 'REJETE') return true;
        const vs = this.state().demandeIndividuel?.validationState || '';
        if (vs === 'CORRECTION') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDa || '';
            return sections.includes('FLUX_TRESORERIE');
        }
        if (vs === 'CORRECTION_DR') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDr || '';
            return sections.includes('FLUX_TRESORERIE');
        }
        if (vs === 'CORRECTION_DE') {
            const sections = this.state().demandeIndividuel?.sectionsARevoirDe || '';
            return sections.includes('FLUX_TRESORERIE');
        }
        return false;
    }

    getCorrectionLevel(): string {
        const vs = this.state().demandeIndividuel?.validationState || '';
        if (vs === 'CORRECTION') return 'DA';
        if (vs === 'CORRECTION_DR') return 'DR';
        if (vs === 'CORRECTION_DE') return 'DE';
        return '';
    }

    resoumettreCorrectionAC(): void {
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;
        const vs = this.state().demandeIndividuel?.validationState || '';
        const avis = this.state().demandeIndividuel?.avisAgentCredit || 'Corrections effectuées';

        let call$;
        if (vs === 'CORRECTION') {
            call$ = this.userService.approuverAC$(+demandeId, avis);
        } else if (vs === 'CORRECTION_DR') {
            call$ = this.userService.validerDA$(+demandeId, avis);
        } else if (vs === 'CORRECTION_DE') {
            call$ = this.userService.validerDR$(+demandeId, avis);
        } else {
            return;
        }

        call$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Corrections resoumises avec succes', life: 3000 });
                this.loadDemandeWithGaranties();
            },
            error: (err: any) => {
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors de la resoumission', life: 5000 });
            }
        });
    }

    getCorrectionInfo(): { level: string; motif: string; sections: string; instructions: string } {
        const d = this.state().demandeIndividuel;
        const vs = d?.validationState || '';
        let raw = { level: '', motif: '', sections: '', instructions: '' };
        if (vs === 'CORRECTION') {
            raw = { level: 'DA', motif: d?.motifRejetDa || '', sections: d?.sectionsARevoirDa || '', instructions: d?.instructionsAc || '' };
        } else if (vs === 'CORRECTION_DR') {
            raw = { level: 'DR', motif: d?.motifRejetDr || '', sections: d?.sectionsARevoirDr || '', instructions: d?.instructionsDa || '' };
        } else if (vs === 'CORRECTION_DE') {
            raw = { level: 'DE', motif: d?.motifRejetDe || '', sections: d?.sectionsARevoirDe || '', instructions: d?.instructionsDr || '' };
        }
        if (raw.sections) {
            raw.sections = raw.sections
                .split(',')
                .map((s: string) => this.getSectionLabel(s.trim()))
                .join(', ');
        }
        return raw;
    }

    isWorkflowAdvanced(): boolean {
        const vs = this.state().demandeIndividuel?.validationState || '';
        return ['APPROVED', 'VALIDATED_DA', 'VALIDATED_DR', 'VALIDATED_FINAL', 'CORRECTION', 'CORRECTION_DR', 'CORRECTION_DE'].includes(vs);
    }

    confirmerWorkflowValidationDA(): void {
        if (this.workflowDAForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        this.userService
            .validerDA$(+demandeId, this.workflowDAForm.value.avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: this.isValidationFinaleDA() ? 'Credit valide definitivement (plafond Directeur d’Agence)' : 'Demande validee et transmise au DR',
                        life: 4000
                    });
                    this.workflowDAForm.reset();
                    this.loadDemandeWithGaranties();
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors de la validation', life: 5000 });
                }
            });
    }

    ouvrirWorkflowRejetDA(): void {
        this.workflowDARejetForm.reset();
        this.workflowDARejetForm.get('sectionsARevoir')?.setValue([]);
        this.state.update(this.mergeState({ showWorkflowRejetDA: true }));
    }

    confirmerWorkflowRejetDA(): void {
        if (this.workflowDARejetForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        const body = {
            motifRejet: this.workflowDARejetForm.value.motifRejet,
            sectionsARevoir: this.workflowDARejetForm.value.sectionsARevoir,
            instructions: this.workflowDARejetForm.value.instructions || undefined
        };

        this.userService
            .rejeterDA$(+demandeId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: 'Demande rejetee par DA', life: 3000 });
                    this.state.update(this.mergeState({ showWorkflowRejetDA: false }));
                    this.workflowDARejetForm.reset();
                    this.loadDemandeWithGaranties();
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }

    // ==================== WORKFLOW DR ====================

    confirmerWorkflowValidationDR(): void {
        if (this.workflowDRForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        this.userService
            .validerDR$(+demandeId, this.workflowDRForm.value.avis)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: this.isValidationFinaleDR() ? 'Credit valide definitivement (plafond Delegue Regional)' : "Demande validee et transmise a la Direction d'Exploitation",
                        life: 4000
                    });
                    this.workflowDRForm.reset();
                    this.loadDemandeWithGaranties();
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors de la validation', life: 5000 });
                }
            });
    }

    ouvrirWorkflowRejetDR(): void {
        this.workflowDRRejetForm.reset();
        this.workflowDRRejetForm.get('sectionsARevoir')?.setValue([]);
        this.state.update(this.mergeState({ showWorkflowRejetDR: true }));
    }

    confirmerWorkflowRejetDR(): void {
        if (this.workflowDRRejetForm.invalid) return;
        const demandeId = this.state().demandeIndividuel?.demandeIndividuelId;
        if (!demandeId) return;

        const body = {
            motifRejet: this.workflowDRRejetForm.value.motifRejet,
            sectionsARevoir: this.workflowDRRejetForm.value.sectionsARevoir,
            instructions: this.workflowDRRejetForm.value.instructions || undefined
        };

        this.userService
            .rejeterDR$(+demandeId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({ severity: 'warn', summary: 'Rejet', detail: 'Demande rejetee par DR', life: 3000 });
                    this.state.update(this.mergeState({ showWorkflowRejetDR: false }));
                    this.workflowDRRejetForm.reset();
                    this.loadDemandeWithGaranties();
                },
                error: (err: any) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err || 'Erreur lors du rejet', life: 5000 });
                }
            });
    }
}
