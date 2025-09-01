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
import { switchMap, EMPTY, Observer } from 'rxjs';
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
        usuarios?: SG_USUARIOS[];
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
        // Nouvelles propriétés pour les avis
        avisList: Avis[];
        loadingAvis: boolean;
        showAvisForm: boolean;
        userHasAvis: boolean;
        currentUserAvis?: Avis;
        submittingAvis: boolean;
        editingAvis: boolean;
        editingAvisId?: number;
        deletingAvisId?: number;
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
        // Initialisation des nouvelles propriétés
        avisList: [],
        loadingAvis: false,
        showAvisForm: true,
        userHasAvis: false,
        currentUserAvis: undefined,
        submittingAvis: false,
        editingAvis: false,
        editingAvisId: undefined,
        deletingAvisId: undefined
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

    constructor() {
        this.updateForm = this.fb.group({
            code: ['', Validators.required],
            usuario: ['', Validators.required],
            statut: ['', Validators.required]
        });

        // Initialiser le formulaire d'avis
        this.avisForm = this.fb.group({
            libele: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
        });
    }

    ngOnInit(): void {
        this.loadDemandeWithGaranties();
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

    onPointVenteChange(event: any): void {
        const selectedPointVente = event.value;
        this.updateForm.get('usuario')?.reset();

        if (selectedPointVente) {
            const codAgencia = selectedPointVente.code;
            const codPuesto = 'AGENCR';
            const indActivo = 'A';

            this.userService
                .getListUsuariosByCodAgencia$(codAgencia, codPuesto, indActivo)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        this.state.update((s) => ({
                            ...s,
                            usuarios: response.data.usuarios
                        }));
                    },
                    error: (error) => {
                        console.error('Error loading usuarios:', error);
                    }
                });
        }
    }

    onSubmit(): void {
        if (this.updateForm.valid) {
            const { statut, usuario } = this.updateForm.value;
            const demandeIndividuelId = this.state().demandeIndividuel?.demandeIndividuelId;

            if (demandeIndividuelId && usuario) {
                this.state.update((s) => ({ ...s, loading: true }));

                this.userService
                    .updateDemandeIndividuel$(statut, usuario.usariosPKId.codUsuarios, +demandeIndividuelId)
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
}
