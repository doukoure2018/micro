import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { DemandeCredit } from '@/interface/demande.credit';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { Selection } from '@/interface/selection';
import { SG_USUARIOS } from '@/interface/sg_usuarios';
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
import { switchMap, EMPTY, Observer, Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Avis } from '@/interface/avis';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { TimelineModule } from 'primeng/timeline';

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
        TimelineModule
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
        demandeIndividuel?: DemandeIndividuel;
        demande_credit?: DemandeCredit;
        documents?: Selection[];
        // usuarios?: SG_USUARIOS[];  // SUPPRIMÉ
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
        avisList: Avis[];
        loadingAvis: boolean;
        showAvisForm: boolean;
        userHasAvis: boolean;
        currentUserAvis?: Avis;
        submittingAvis: boolean;
        editingAvis: boolean;
        editingAvisId?: number;
        deletingAvisId?: number;
        agentValidation: {
            isValid: boolean;
            isActive: boolean;
            isLoading: boolean;
            message: string;
            checked: boolean;
        };
        foundAgent?: SG_USUARIOS;
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
        agentValidation: {
            isValid: false,
            isActive: false,
            isLoading: false,
            message: '',
            checked: false
        },
        foundAgent: undefined
    });

    private agentCodeSubject = new Subject<string>();

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

    constructor() {
        this.updateForm = this.fb.group({
            code: ['', Validators.required],
            codAgent: ['', [Validators.required]],
            statut: ['', Validators.required]
        });

        this.avisForm = this.fb.group({
            libele: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
    }

    ngOnInit(): void {
        this.loadDemandeWithGaranties();
        this.setupAgentCodeValidation();
    }

    private setupAgentCodeValidation(): void {
        this.agentCodeSubject
            .pipe(
                debounceTime(500), // Attendre 500ms après que l'utilisateur arrête de taper
                distinctUntilChanged(),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((codAgent) => {
                if (codAgent && codAgent.length >= 2) {
                    this.validateAgentCode(codAgent);
                }
            });
    }

    // Valider le code agent via SAF (comme dans create-user)
    private validateAgentCode(codAgent: string): void {
        const pointVente = this.updateForm.get('code')?.value;

        if (!pointVente) {
            this.state.update((s) => ({
                ...s,
                agentValidation: {
                    isValid: false,
                    isActive: false,
                    isLoading: false,
                    message: "Veuillez d'abord sélectionner un point de service",
                    checked: true
                }
            }));
            return;
        }

        this.state.update((s) => ({
            ...s,
            agentValidation: {
                ...s.agentValidation,
                isLoading: true,
                message: 'Vérification en cours...'
            }
        }));

        this.userService
            .getUserSaf$(codAgent)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('Agent validation response:', response);

                    if (response.data?.usuario) {
                        const usuario: SG_USUARIOS = response.data.usuario;
                        const isActive = usuario.indActivo === 'A';

                        this.state.update((s) => ({
                            ...s,
                            foundAgent: usuario,
                            agentValidation: {
                                isValid: true,
                                isActive: isActive,
                                isLoading: false,
                                message: isActive ? `Agent validé: ${usuario.nom_USUARIO}` : 'Agent existe mais non actif',
                                checked: true
                            }
                        }));

                        if (isActive) {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Validation réussie',
                                detail: `Agent ${usuario.nom_USUARIO} validé et actif`,
                                life: 3000
                            });
                        } else {
                            this.messageService.add({
                                severity: 'warn',
                                summary: 'Agent non actif',
                                detail: "Cet agent existe mais n'est pas actif",
                                life: 5000
                            });
                        }
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            foundAgent: undefined,
                            agentValidation: {
                                isValid: false,
                                isActive: false,
                                isLoading: false,
                                message: `Aucun agent trouvé avec le code "${codAgent}"`,
                                checked: true
                            }
                        }));

                        this.messageService.add({
                            severity: 'error',
                            summary: 'Agent non trouvé',
                            detail: 'Aucun agent trouvé avec ce code',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error validating agent code:', error);
                    this.state.update((s) => ({
                        ...s,
                        foundAgent: undefined,
                        agentValidation: {
                            isValid: false,
                            isActive: false,
                            isLoading: false,
                            message: 'Erreur lors de la validation',
                            checked: true
                        }
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de validation',
                        detail: 'Impossible de valider le code agent',
                        life: 3000
                    });
                }
            });
    }

    canSubmitForm(): boolean {
        const validation = this.state().agentValidation;
        return this.updateForm.valid && validation.checked && validation.isActive;
    }

    onAgentCodeChange(codAgent: string): void {
        // Réinitialiser l'état de validation pendant la saisie
        this.state.update((s) => ({
            ...s,
            agentValidation: {
                ...s.agentValidation,
                checked: false,
                message: ''
            },
            foundAgent: undefined
        }));

        // Déclencher la validation avec debounce
        this.agentCodeSubject.next(codAgent?.trim()?.toUpperCase());
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
                            statusOptions.push({ label: 'Selection', value: 'SELECTION' });
                        } else {
                            statusOptions.push({ label: 'Validation', value: 'VALIDATION' });
                        }

                        this.state.update((s) => ({
                            ...s,
                            demandeIndividuel: demandeData,
                            statusOptions: statusOptions,
                            user: response.data.user,
                            demande_credit: response.data.demande_credit,
                            hasDemandeCredit: response.data.hasDemandeCredit,
                            hasDossierCredit: response.data.hasDossierCredit,
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

                        this.loadDocuments(+demandeData.demandeIndividuelId!);

                        // Charger les avis
                        this.loadAvis(+demandeData.demandeIndividuelId!);

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

    // onPointVenteChange - Simplifié
    onPointVenteChange(event: any): void {
        // Réinitialiser le champ agent et son état de validation
        this.updateForm.get('codAgent')?.reset();
        this.state.update((s) => ({
            ...s,
            agentValidation: {
                isValid: false,
                isActive: false,
                isLoading: false,
                message: '',
                checked: false
            },
            foundAgent: undefined
        }));
    }
    onSubmit(): void {
        if (this.updateForm.valid && this.canSubmitForm()) {
            const { statut } = this.updateForm.value;
            const demandeIndividuelId = this.state().demandeIndividuel?.demandeIndividuelId;
            const foundAgent = this.state().foundAgent;

            if (demandeIndividuelId && foundAgent) {
                this.state.update((s) => ({ ...s, loading: true }));

                this.userService
                    .updateDemandeIndividuel$(statut, foundAgent.usariosPKId!.codUsuarios!, +demandeIndividuelId)
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

            if (!this.state().agentValidation.isActive) {
                this.messageService.add({
                    severity: 'warn',
                    summary: 'Attention',
                    detail: 'Veuillez saisir un code agent valide et actif',
                    life: 3000
                });
            }
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
     * Calculer le total empruntable
     */
    getTotalEmprunte(): number {
        const garanties = this.state().demandeIndividuel?.garanties;
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total, g) => total + (g.valeurEmprunte || 0), 0);
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

        this.state.update((s) => ({
            ...s,
            selectedPDFDocument: document,
            pdfBlobUrl: document.doc || null,
            showPDFPreview: true
        }));

        if (document.doc) {
            window.open(document.doc, '_blank');
        }
    }

    closePreviewDialog(): void {
        this.state.update((s) => ({
            ...s,
            showPreviewDialog: false,
            selectedDocumentForPreview: null
        }));
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
        if (!demandeIndividuel.demandeIndividuelId || !demandeIndividuel?.codUsuarios) {
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
                    .updateDemandeIndividuel$('APPROVED', demandeIndividuel?.codUsuarios!, demandeIndividuel.demandeIndividuelId!)
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
                    <h1>DEMANDE DE CRÉDIT - GROS DOSSIER</h1>
                    <div class="header-info">
                        <div>
                            <strong>N° Dossier:</strong> ${demande?.demandeIndividuelId}<br>
                            <strong>Date de demande:</strong> ${this.formatDateForPrint(demande?.createdAt)}<br>
                            <strong>Date d'impression:</strong> ${dateImpression}
                        </div>
                        <div>
                            <strong>Agence:</strong> ${this.state().pointVente?.libele || 'Non assigné'}<br>
                            <strong>Statut:</strong> ${demande?.statutDemande}<br>
                            <strong>État de validation:</strong> ${demande?.validationState}
                        </div>
                    </div>
                </div>

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
                        <tr>
                            <td class="label">Adresse:</td>
                            <td class="value" colspan="3">${demande?.addresseDomicileContact}</td>
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
            <td class="text-right">${this.formatCurrency(g.valeurEmprunte)}</td>
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

    // Ajouter cette méthode dans DetailComponent
    goBack(): void {
        if (this.state().user?.role === 'MANAGER') {
            this.router.navigate(['/dashboards']);
        } else {
            this.router.navigate(['/dashboards/agent-credit/list-selection-ind']);
        }
    }
}
