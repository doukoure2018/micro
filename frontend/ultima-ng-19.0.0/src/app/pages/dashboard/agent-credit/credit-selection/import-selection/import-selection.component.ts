import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { IResponse } from '@/interface/response';
import { Selection } from '@/interface/selection';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { catchError, EMPTY, forkJoin, Observer, of, switchMap, tap } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
@Component({
    selector: 'app-import-selection',
    imports: [CommonModule, ToastModule, CardModule, ProgressSpinnerModule, MessageModule, FileUploadModule, ButtonModule, ImageModule, TableModule, ConfirmDialogModule, DialogModule, TooltipModule],
    templateUrl: './import-selection.component.html',
    styles: `
        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        /* Styles pour la classe card de PrimeNG */
        .card {
            background: var(--surface-card);
            padding: 2rem;
            border-radius: 10px;
            margin-bottom: 1rem;
            box-shadow:
                0 2px 1px -1px rgba(0, 0, 0, 0.2),
                0 1px 1px 0 rgba(0, 0, 0, 0.14),
                0 1px 3px 0 rgba(0, 0, 0, 0.12);
        }

        /* Custom file upload button */
        .custom-file-upload .p-button {
            background: linear-gradient(to right, var(--primary-500), var(--primary-600));
            border: none;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .custom-file-upload .p-button:hover {
            background: linear-gradient(to right, var(--primary-600), var(--primary-700));
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }

        /* Preview dialog styles */
        .preview-dialog .p-dialog-content {
            padding: 1.5rem;
        }

        .preview-dialog .p-dialog-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
        }

        /* Loading Animation */
        @keyframes shimmer {
            0% {
                background-position: -200px 0;
            }
            100% {
                background-position: calc(200px + 100%) 0;
            }
        }

        .loading-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
            background-size: 200px 100%;
            animation: shimmer 1.5s infinite;
        }

        /* Smooth Animations */
        .fade-in {
            animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Card hover effects */
        .shadow:hover {
            box-shadow:
                0 20px 25px -5px rgba(0, 0, 0, 0.1),
                0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Grid responsiveness */
        @media (max-width: 640px) {
            .container {
                padding-left: 1rem;
                padding-right: 1rem;
            }

            .grid.grid-cols-12 .col-span-12 {
                grid-column: span 12 / span 12;
            }

            .grid.grid-cols-12 .md\\:col-span-6 {
                grid-column: span 12 / span 12;
            }

            .grid.grid-cols-12 .lg\\:col-span-4 {
                grid-column: span 12 / span 12;
            }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
            .grid.grid-cols-12 .md\\:col-span-6 {
                grid-column: span 6 / span 6;
            }

            .grid.grid-cols-12 .lg\\:col-span-4 {
                grid-column: span 6 / span 6;
            }
        }

        @media (min-width: 1025px) {
            .grid.grid-cols-12 .lg\\:col-span-4 {
                grid-column: span 4 / span 4;
            }
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            .card {
                background: var(--surface-900);
                color: var(--text-color);
            }
        }

        .pdf-preview-dialog .p-dialog-content {
            padding: 1rem;
            height: calc(80vh - 120px);
            overflow: hidden;
        }

        .pdf-preview-dialog .p-dialog-header {
            background: linear-gradient(to right, #dc2626, #ef4444);
            color: white;
        }

        .pdf-preview-dialog .p-dialog-header .p-dialog-title {
            color: white;
            font-weight: 600;
        }

        .pdf-preview-dialog .p-dialog-header .p-dialog-header-icons button {
            color: white;
        }

        .pdf-preview-dialog .p-dialog-header .p-dialog-header-icons button:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Styles pour les différents types de fichiers */
        .file-type-pdf {
            background: linear-gradient(135deg, #fee2e2, #fecaca);
            border: 1px solid #fca5a5;
        }

        .file-type-word {
            background: linear-gradient(135deg, #dbeafe, #bfdbfe);
            border: 1px solid #93c5fd;
        }

        .file-type-excel {
            background: linear-gradient(135deg, #dcfce7, #bbf7d0);
            border: 1px solid #86efac;
        }

        .file-type-image {
            background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
            border: 1px solid #c4b5fd;
        }

        /* Animation pour le chargement PDF */
        .pdf-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 200px;
            background: #f8fafc;
            border-radius: 8px;
        }

        .pdf-loading::after {
            content: '';
            width: 40px;
            height: 40px;
            border: 4px solid #e2e8f0;
            border-top: 4px solid #dc2626;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% {
                transform: rotate(0deg);
            }
            100% {
                transform: rotate(360deg);
            }
        }

        /* Responsive pour mobile */
        @media (max-width: 768px) {
            .pdf-preview-dialog {
                width: 95vw !important;
                height: 90vh !important;
            }

            .pdf-preview-dialog .p-dialog-content {
                height: calc(90vh - 120px);
            }
        }

        /* Styles pour les badges de type de fichier */
        .file-badge {
            transition: all 0.2s ease;
        }

        .file-badge:hover {
            transform: scale(1.05);
        }

        /* Amélioration du contraste pour le mode sombre */
        @media (prefers-color-scheme: dark) {
            .file-type-pdf {
                background: linear-gradient(135deg, #7f1d1d, #991b1b);
                border-color: #dc2626;
            }

            .file-type-word {
                background: linear-gradient(135deg, #1e3a8a, #1d4ed8);
                border-color: #3b82f6;
            }

            .file-type-excel {
                background: linear-gradient(135deg, #14532d, #166534);
                border-color: #22c55e;
            }

            .file-type-image {
                background: linear-gradient(135deg, #581c87, #6b21a8);
                border-color: #a855f7;
            }
        }
    `,
    providers: [MessageService, ConfirmationService]
})
export class ImportSelectionComponent {
    private activatedRoute = inject(ActivatedRoute);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private confirmationService = inject(ConfirmationService);

    // 2. Injection dans le constructeur
    private domSanitizer = inject(DomSanitizer);

    // Remplacez complètement votre state signal par celui-ci :
    state = signal<{
        loading: boolean;
        error: string | null;
        selectedFiles: File[];
        previews: { file: File; url: string; width?: number; height?: number }[];
        document: Selection | null;
        documents: Selection[] | null;
        demandeIndividuel: DemandeIndividuel | null;
        demandeindividuel_id: number | null;
        userId: number | null;
        showPreviewDialog: boolean;
        selectedDocumentForPreview: Selection | null;
        // Propriétés PDF ajoutées
        showPDFPreview: boolean;
        selectedPDFFile: File | null;
        pdfBlobUrl: string | null;
    }>({
        loading: false,
        error: null,
        selectedFiles: [],
        previews: [],
        document: null,
        documents: null,
        demandeIndividuel: null,
        demandeindividuel_id: null,
        userId: null,
        showPreviewDialog: false,
        selectedDocumentForPreview: null,
        // Valeurs par défaut PDF
        showPDFPreview: false,
        selectedPDFFile: null,
        pdfBlobUrl: null
    });
    // 3. Nouvelles propriétés dans le state signal

    ngOnInit(): void {
        this.loadDemandeDocument();
    }

    private loadDemandeDocument(): void {
        this.activatedRoute.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const demandeId = params.get('demandeindividuel_id');
                    const userId = params.get('userId');
                    if (demandeId && userId) {
                        this.state.update((s) => ({
                            ...s,
                            demandeindividuel_id: Number(demandeId),
                            userId: Number(userId)
                        }));
                        return this.userService.getAllDocuments$(+demandeId);
                    } else {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            error: 'Invalid demandeId or userId'
                        }));
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(this.getAllDocuments);
    }

    private getAllDocuments: Observer<any> = {
        next: (response: IResponse) => {
            this.state.update((s) => ({
                ...s,
                documents: response.data.documents!,
                demandeIndividuel: response.data.demandeIndividuel
            }));
        },
        error: (error: string) => {
            this.state.update((s) => ({ ...s, loading: false, error: error }));
        },
        complete: () => {}
    };

    /**
     * Version améliorée de deleteDocument avec feedback visuel
     */
    deleteDocument(document: Selection): void {
        if (!document || !document.selectionId || !this.state().demandeindividuel_id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Impossible de supprimer le document : Informations manquantes'
            });
            return;
        }

        this.state.update((s) => ({ ...s, loading: true }));

        this.userService
            .deleteDocument$(document.selectionId!, this.state().demandeindividuel_id!)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        // Supprimer le document de la liste
                        documents: s.documents?.filter((doc) => doc.selectionId !== document.selectionId) || null
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Document supprimé avec succès'
                    });
                },
                error: (err) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: err.message || 'Échec de la suppression du document'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur de suppression',
                        detail: err.message || 'Erreur lors de la suppression du document'
                    });
                }
            });
    }

    approvedDemande(demandeIndividuel: DemandeIndividuel, userId: number): void {
        if (!demandeIndividuel.demandeindividuel_id || !demandeIndividuel?.codUsuarios) {
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
                    .updateDemandeIndividuel$('APPROVED', demandeIndividuel?.codUsuarios, demandeIndividuel.demandeindividuel_id!)
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
     * Méthode améliorée pour la sélection de fichiers avec validation
     */
    onFileSelect(event: any): void {
        const files = event.files;
        if (!files || files.length === 0) return;

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        const maxFileSize = 10 * 1024 * 1024; // 10MB
        const maxFiles = 10; // Limite de fichiers

        const currentFiles = this.state().selectedFiles.length;
        const newFiles: File[] = [];
        const newPreviews: { file: File; url: string; width?: number; height?: number }[] = [];
        const errors: string[] = [];

        for (const file of files) {
            // Vérifications
            if (currentFiles + newFiles.length >= maxFiles) {
                errors.push(`Limite de ${maxFiles} fichiers atteinte`);
                break;
            }

            if (file.size > maxFileSize) {
                errors.push(`${file.name}: Fichier trop volumineux (max 10MB)`);
                continue;
            }

            if (!allowedTypes.includes(file.type)) {
                errors.push(`${file.name}: Format non supporté`);
                continue;
            }

            // Vérifier les doublons
            const isDuplicate = this.state().selectedFiles.some((existingFile) => existingFile.name === file.name && existingFile.size === file.size);

            if (isDuplicate) {
                errors.push(`${file.name}: Fichier déjà sélectionné`);
                continue;
            }

            const previewObj: { file: File; url: string; width?: number; height?: number } = {
                file: file,
                url: URL.createObjectURL(file)
            };

            newPreviews.push(previewObj);
            newFiles.push(file);

            // Obtenir les dimensions pour les images
            if (file.type.startsWith('image/')) {
                const img = new Image();
                img.onload = () => {
                    this.state.update((s) => {
                        const updatedPreviews = s.previews.map((p) => {
                            if (p.file === file) {
                                return { ...p, width: img.width, height: img.height };
                            }
                            return p;
                        });

                        return { ...s, previews: updatedPreviews };
                    });
                };
                img.src = previewObj.url;
            }
        }

        // Afficher les erreurs
        if (errors.length > 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: errors.join('\n'),
                life: 5000
            });
        }

        // Ajouter les fichiers valides
        if (newFiles.length > 0) {
            this.state.update((s) => ({
                ...s,
                selectedFiles: [...s.selectedFiles, ...newFiles],
                previews: [...s.previews, ...newPreviews],
                error: null
            }));

            this.messageService.add({
                severity: 'success',
                summary: 'Fichiers ajoutés',
                detail: `${newFiles.length} fichier(s) sélectionné(s)`,
                life: 3000
            });
        }
    }

    /**
     * Méthode d'upload corrigée et simplifiée
     */
    uploadDocuments(): void {
        const { selectedFiles, userId, demandeindividuel_id } = this.state();

        if (selectedFiles.length === 0 || !userId || !demandeindividuel_id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez sélectionner des fichiers et vérifier les paramètres'
            });
            return;
        }

        this.state.update((s) => ({
            ...s,
            loading: true,
            error: null
        }));

        // Créer les promesses d'upload
        const uploadPromises = selectedFiles.map((file) => {
            const formData = new FormData();
            formData.append('image', file);

            return this.userService.addDocuments$(userId, demandeindividuel_id, formData).pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError((error) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Échec du téléversement',
                        detail: `Erreur pour ${file.name}: ${error.message || 'Erreur inconnue'}`,
                        life: 5000
                    });
                    return of(null);
                })
            );
        });

        // Exécuter tous les uploads
        forkJoin(uploadPromises)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (responses) => {
                    const successCount = responses.filter((r) => r !== null).length;
                    const failureCount = responses.length - successCount;

                    // Nettoyer les aperçus
                    this.state().previews.forEach((preview) => {
                        URL.revokeObjectURL(preview.url);
                    });

                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        selectedFiles: [],
                        previews: []
                    }));

                    // Messages de résultat
                    if (successCount > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Téléversement réussi',
                            detail: `${successCount} document(s) téléversé(s) avec succès`,
                            life: 5000
                        });

                        // Actualiser la liste des documents
                        this.loadDemandeDocument();
                    }

                    if (failureCount > 0) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Téléversement partiel',
                            detail: `${failureCount} document(s) n'ont pas pu être téléversés`,
                            life: 5000
                        });
                    }
                },
                error: (err) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: err.message || 'Erreur lors du téléversement des documents'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Échec du téléversement',
                        detail: err.message || 'Erreur lors du téléversement des documents',
                        life: 5000
                    });
                }
            });
    }

    /**
     * Enhanced viewDocument method to handle both images and PDFs
     */
    viewDocument(document: Selection): void {
        console.log('viewDocument called with:', document);

        if (this.isPDFDocument(document)) {
            // Preview PDF in PDF dialog
            this.previewSavedPDF(document);
        } else if (this.isImageDocument(document)) {
            // Preview image in image dialog
            this.state.update((s) => ({
                ...s,
                selectedDocumentForPreview: document,
                showPreviewDialog: true
            }));
        } else {
            // Fallback for unknown file types
            this.messageService.add({
                severity: 'info',
                summary: 'Prévisualisation',
                detail: 'Prévisualisation non disponible pour ce type de fichier'
            });
        }
    }

    /**
     * Ferme la dialog de prévisualisation
     */
    closePreviewDialog(): void {
        console.log('closePreviewDialog called'); // Debug log

        this.state.update((s) => ({
            ...s,
            showPreviewDialog: false,
            selectedDocumentForPreview: null
        }));
    }

    /**
     * Add getter and setter for better dialog control
     */
    set showPDFPreview(value: boolean) {
        if (!value) {
            this.closePDFPreview();
        } else {
            this.state.update((s) => ({ ...s, showPDFPreview: true }));
        }
    }

    /**
     * Méthode alternative pour ouvrir la prévisualisation (simplifiée)
     */
    openPreview(doc: Selection): void {
        console.log('Opening preview for document:', doc);

        this.state.update((currentState) => {
            console.log('Current state before update:', currentState.showPreviewDialog);
            return {
                ...currentState,
                selectedDocumentForPreview: doc,
                showPreviewDialog: true
            };
        });

        // Vérification après mise à jour
        setTimeout(() => {
            console.log('State after update:', this.state().showPreviewDialog);
            console.log('Selected doc:', this.state().selectedDocumentForPreview);
        }, 100);
    }

    // 2. Ajoutez cette méthode pour débugger
    debugState(): void {
        console.log('Current state:', this.state());
        console.log('Show dialog:', this.state().showPreviewDialog);
        console.log('Selected doc:', this.state().selectedDocumentForPreview);
    }

    // 3. Méthode pour gérer les clics sur les images (sans conflit d'événements)
    onImageClick(event: Event, doc: Selection): void {
        event.stopPropagation(); // Empêche la propagation de l'événement
        console.log('Image clicked, document:', doc);
        this.openPreview(doc);
    }

    // 4. Méthode pour gérer les clics sur les boutons de prévisualisation
    onPreviewButtonClick(event: Event, doc: Selection): void {
        event.stopPropagation(); // Empêche la propagation de l'événement
        console.log('Preview button clicked, document:', doc);
        this.openPreview(doc);
    }

    /**
     * Getters et setters pour le dialog de prévisualisation
     */
    get showPreviewDialog(): boolean {
        return this.state().showPreviewDialog;
    }

    /**
     * Setter pour showPreviewDialog (pour le template)
     */
    set showPreviewDialog(value: boolean) {
        this.state.update((s) => ({
            ...s,
            showPreviewDialog: value,
            selectedDocumentForPreview: value ? s.selectedDocumentForPreview : null
        }));
    }

    /**
     * Getter pour selectedDocumentForPreview (pour le template)
     */
    get selectedDocumentForPreview(): Selection | null {
        return this.state().selectedDocumentForPreview;
    }

    /**
     * Confirmation de suppression avec style amélioré
     */
    confirmDelete(document: Selection): void {
        this.confirmationService.confirm({
            message: 'Êtes-vous certain de vouloir supprimer ce document ? Cette action est irréversible.',
            header: 'Confirmer la suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui, supprimer',
            rejectLabel: 'Annuler',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                this.deleteDocument(document);
            },
            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Suppression annulée',
                    detail: 'Le document a été conservé',
                    life: 3000
                });
            }
        });
    }

    /**
     * Estime la taille du fichier basée sur l'URL de l'image
     * (Optionnel - vous pouvez adapter selon vos besoins)
     */
    getFileSize(document: Selection): string {
        // Vous pouvez améliorer cette méthode selon vos données
        return 'Image';
    }

    /**
     * Méthode pour valider le type de fichier
     */
    private isValidFileType(file: File): boolean {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        return allowedTypes.includes(file.type);
    }

    /**
     * Supprime un fichier de la liste des fichiers sélectionnés
     * @param index - L'index du fichier à supprimer
     */
    removeFile(index: number): void {
        this.state.update((s) => {
            const newSelectedFiles = [...s.selectedFiles];
            const newPreviews = [...s.previews];

            // Libérer l'URL de l'objet pour éviter les fuites mémoire
            if (newPreviews[index]) {
                URL.revokeObjectURL(newPreviews[index].url);
            }

            // Supprimer le fichier et l'aperçu
            newSelectedFiles.splice(index, 1);
            newPreviews.splice(index, 1);

            return {
                ...s,
                selectedFiles: newSelectedFiles,
                previews: newPreviews
            };
        });

        // Message de confirmation (optionnel)
        this.messageService.add({
            severity: 'info',
            summary: 'Fichier supprimé',
            detail: 'Le fichier a été retiré de la sélection',
            life: 2000
        });
    }

    /**
     * Vérifie si l'image est de grande taille
     */
    isLargeImage(preview: { file: File; url: string; width?: number; height?: number }): boolean {
        return (preview.width && preview.width > 2000) || (preview.height && preview.height > 2000) || false;
    }

    /**
     * Prévisualise un fichier PDF
     */
    previewPDF(preview: { file: File; url: string; width?: number; height?: number }): void {
        if (preview.file.type !== 'application/pdf') {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Ce fichier n'est pas un PDF"
            });
            return;
        }

        this.state.update((s) => ({
            ...s,
            selectedPDFFile: preview.file,
            pdfBlobUrl: preview.url,
            showPDFPreview: true
        }));
    }

    /**
     * Updated pdfSafeUrl getter to handle direct URLs
     */
    get pdfSafeUrl(): SafeResourceUrl | null {
        const pdfUrl = this.state().pdfBlobUrl;
        if (!pdfUrl) return null;

        // Check if it's already a safe URL or needs to be sanitized
        if (pdfUrl.startsWith('blob:')) {
            return this.domSanitizer.bypassSecurityTrustResourceUrl(pdfUrl);
        } else {
            // For direct URLs, add #toolbar=0 to hide PDF toolbar
            const urlWithParams = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`;
            return this.domSanitizer.bypassSecurityTrustResourceUrl(urlWithParams);
        }
    }

    /**
     * Downloads the PDF
     */
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

            this.messageService.add({
                severity: 'success',
                summary: 'Téléchargement',
                detail: 'Le téléchargement du PDF a commencé'
            });
        }
    }

    /**
     * Formate la taille du fichier de manière lisible
     */
    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /**
     * Extrait l'extension du fichier
     */
    getFileExtension(filename: string): string {
        const extension = filename.split('.').pop()?.toUpperCase();
        return extension || 'FILE';
    }

    /**
     * Obtient le type de fichier pour l'affichage
     */
    getFileTypeDisplay(file: File): string {
        const type = file.type;

        if (type.includes('image')) return 'Image';
        if (type === 'application/pdf') return 'PDF';
        if (type.includes('word') || type.includes('document')) return 'Word';
        if (type.includes('excel') || type.includes('spreadsheet')) return 'Excel';
        if (type.includes('powerpoint') || type.includes('presentation')) return 'PowerPoint';

        return 'Fichier';
    }

    /**
     * Obtient la couleur du badge selon le type de fichier
     */
    getFileTypeBadgeClass(file: File): string {
        const type = file.type;

        if (type.includes('image')) return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
        if (type === 'application/pdf') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
        if (type.includes('word') || type.includes('document')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300';
        if (type.includes('excel')) return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
        if (type.includes('powerpoint')) return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';

        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }

    /**
     * Vérifie si un fichier peut être prévisualisé
     */
    canPreviewFile(file: File): boolean {
        return file.type.includes('image') || file.type === 'application/pdf';
    }

    /**
     * Ouvre la prévisualisation appropriée selon le type de fichier
     */
    openFilePreview(preview: { file: File; url: string; width?: number; height?: number }): void {
        if (preview.file.type === 'application/pdf') {
            this.previewPDF(preview);
        } else if (preview.file.type.includes('image')) {
            // Logique pour prévisualiser les images (existante)
            console.log('Preview image:', preview);
        } else {
            this.messageService.add({
                severity: 'info',
                summary: 'Prévisualisation non disponible',
                detail: 'Ce type de fichier ne peut pas être prévisualisé'
            });
        }
    }

    /**
     * Nettoyage des ressources PDF
     */
    ngOnDestroy(): void {
        // Nettoyer les URLs créées pour éviter les fuites mémoire
        this.state().previews.forEach((preview) => {
            URL.revokeObjectURL(preview.url);
        });

        // Nettoyer l'URL PDF si elle existe
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl) {
            URL.revokeObjectURL(pdfUrl);
        }
    }

    /**
     * Determines if a document URL points to a PDF file
     */
    isPDFDocument(doc: Selection): boolean {
        if (!doc.doc) return false;
        return doc.doc.toLowerCase().includes('.pdf');
    }

    /**
     * Determines if a document URL points to an image file
     */
    isImageDocument(doc: Selection): boolean {
        if (!doc.doc) return false;
        const url = doc.doc.toLowerCase();
        return url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif');
    }

    /**
     * Gets file extension from document URL
     */
    getDocumentExtension(doc: Selection): string {
        if (!doc.doc) return '';
        const url = doc.doc.toLowerCase();
        if (url.includes('.pdf')) return 'PDF';
        if (url.includes('.png')) return 'PNG';
        if (url.includes('.jpg') || url.includes('.jpeg')) return 'JPG';
        if (url.includes('.gif')) return 'GIF';
        if (url.includes('.doc')) return 'DOC';
        if (url.includes('.docx')) return 'DOCX';
        return 'FILE';
    }

    /**
     * Enhanced PDF preview that works around X-Frame-Options
     */
    previewSavedPDF(document: Selection): void {
        if (!this.isPDFDocument(document)) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Ce document n'est pas un PDF"
            });
            return;
        }

        // Instead of iframe, provide download and new tab options
        this.state.update((s) => ({
            ...s,
            selectedPDFFile: new File([], `document.pdf`, { type: 'application/pdf' }),
            pdfBlobUrl: document.doc || null,
            showPDFPreview: true
        }));

        // Automatically open in new tab as primary action
        window.open(document.doc, '_blank');

        this.messageService.add({
            severity: 'info',
            summary: 'PDF ouvert',
            detail: "Le PDF s'ouvre dans un nouvel onglet",
            life: 3000
        });
    }

    /**
     * Handle PDF load success
     */
    onPDFLoad(): void {
        console.log('PDF loaded successfully');
    }

    /**
     * Handle PDF load error
     */
    onPDFError(): void {
        console.error('Error loading PDF');
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: 'Le PDF ne peut pas être affiché dans cette fenêtre. Utilisez le bouton de téléchargement.'
        });
    }

    /**
     * Enhanced close method for PDF preview
     */
    closePDFPreview(): void {
        console.log('Closing PDF preview dialog'); // Debug log

        // Clean up blob URL if it exists and is a blob
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pdfUrl);
        }

        // Reset all PDF-related state
        this.state.update((s) => ({
            ...s,
            showPDFPreview: false,
            selectedPDFFile: null,
            pdfBlobUrl: null
        }));

        console.log('PDF dialog state after close:', this.state().showPDFPreview); // Debug log
    }

    /**
     * Opens PDF in new tab
     */
    openPDFInNewTab(): void {
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl) {
            window.open(pdfUrl, '_blank');
            this.messageService.add({
                severity: 'success',
                summary: 'PDF ouvert',
                detail: "Le PDF s'ouvre dans un nouvel onglet"
            });
        }
    }

    /**
     * Copies PDF link to clipboard
     */
    copyPDFLink(): void {
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl) {
            navigator.clipboard
                .writeText(pdfUrl)
                .then(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Lien copié',
                        detail: 'Le lien du PDF a été copié dans le presse-papiers'
                    });
                })
                .catch(() => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de copier le lien'
                    });
                });
        }
    }
}
