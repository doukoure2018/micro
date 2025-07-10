import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { Selection } from '@/interface/selection';
import { SG_USUARIOS } from '@/interface/sg_usuarios';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
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
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { switchMap, EMPTY, Observer } from 'rxjs';

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
        TooltipModule
    ],
    templateUrl: './detail.component.html',
    styles: `
        /* Preview dialog styles */
        .preview-dialog .p-dialog-content {
            padding: 1.5rem;
        }

        .preview-dialog .p-dialog-header {
            padding: 1.5rem 1.5rem 1rem 1.5rem;
        }

        /* PDF Preview Dialog */
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

        /* Document Cards */
        .document-card {
            transition: all 0.3s ease;
            border: 1px solid var(--surface-border);
        }

        .document-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        /* File type specific styles */
        .file-type-pdf {
            background: linear-gradient(135deg, #fee2e2, #fecaca);
            border: 1px solid #fca5a5;
        }

        .file-type-image {
            background: linear-gradient(135deg, #f3e8ff, #e9d5ff);
            border: 1px solid #c4b5fd;
        }

        /* Dark mode adjustments */
        @media (prefers-color-scheme: dark) {
            .file-type-pdf {
                background: linear-gradient(135deg, #7f1d1d, #991b1b);
                border-color: #dc2626;
            }

            .file-type-image {
                background: linear-gradient(135deg, #581c87, #6b21a8);
                border-color: #a855f7;
            }
        }

        /* Modern grid responsiveness */
        @media (max-width: 640px) {
            .documents-grid {
                grid-template-columns: 1fr;
            }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
            .documents-grid {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        @media (min-width: 1025px) {
            .documents-grid {
                grid-template-columns: repeat(3, 1fr);
            }
        }

        /* Smooth animations */
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
    `,
    providers: [MessageService]
})
export class DetailComponent {
    state = signal<{
        pointVentes?: PointVente[];
        pointVente?: PointVente;
        demandeIndividuel?: DemandeIndividuel;
        documents?: Selection[];
        usuarios?: SG_USUARIOS[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        statusOptions: { label: string; value: string }[];
        // Nouvelles propriétés pour les previews
        showPreviewDialog: boolean;
        selectedDocumentForPreview: Selection | null;
        showPDFPreview: boolean;
        selectedPDFDocument: Selection | null;
        pdfBlobUrl: string | null;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        statusOptions: [],
        // Valeurs par défaut pour les previews
        showPreviewDialog: false,
        selectedDocumentForPreview: null,
        showPDFPreview: false,
        selectedPDFDocument: null,
        pdfBlobUrl: null
    });

    updateForm: FormGroup;
    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);
    private domSanitizer: DomSanitizer = inject(DomSanitizer);

    constructor() {
        this.updateForm = this.fb.group({
            code: ['', Validators.required],
            usuario: ['', Validators.required],
            statut: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDemandeInfo();
    }

    private loadDemandeInfo(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const demandeindividuel_id = params.get('demandeindividuel_id');
                    if (demandeindividuel_id) {
                        this.state.set({ ...this.state(), loading: true, message: undefined, error: undefined });
                        return this.userService.getDetailDemandeIndividuel$(+demandeindividuel_id);
                    } else {
                        this.state.set({ ...this.state(), loading: false, message: undefined, error: 'Invalide Code AgenceId or not exist' });
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(this.getDetailIndividuel);
    }

    private getDetailIndividuel: Observer<IResponse> = {
        next: (response: IResponse) => {
            const agenceId = response.data.demandeIndividuel.agence;
            // Determine available status options based on current demande state
            const statusOptions: { label: string; value: string }[] = [];
            const demandeInfo = response.data.demandeIndividuel;

            if (demandeInfo.statutDemande === 'EN_ATTENTE' && demandeInfo.validationState === 'NOUVEAU') {
                statusOptions.push({ label: 'Selection', value: 'SELECTION' });
            } else {
                statusOptions.push({ label: 'Validation', value: 'VALIDATION' });
            }
            this.state.set({
                ...this.state(),
                demandeIndividuel: response.data.demandeIndividuel,
                documents: response.data.documents,
                pointVente: response.data.pointVente,
                statusOptions: statusOptions,
                loading: false,
                message: response.message,
                error: undefined
            });

            // Load point de ventes for the agence
            this.loadPointVentes(agenceId);
        },
        error: (error: string) => {
            this.state.set({ ...this.state(), loading: false, message: undefined, error: error });
        },
        complete: () => {}
    };

    private loadPointVentes(agenceId: number): void {
        this.userService
            .getAllPointVenteByAgenceId$(+agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.set({ ...this.state(), pointVentes: response.data.pointVentes });
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
            const codPuesto = 'AGENCR'; // Default value
            const indActivo = 'A'; // Default value

            this.userService
                .getListUsuariosByCodAgencia$(codAgencia, codPuesto, indActivo)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        this.state.set({ ...this.state(), usuarios: response.data.usuarios });
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
            const demandeIndividuelId = this.state().demandeIndividuel?.demandeindividuel_id;

            if (demandeIndividuelId && usuario) {
                this.state.set({ ...this.state(), loading: true });

                this.userService
                    .updateDemandeIndividuel$(statut, usuario.usariosPKId.codUsuarios, demandeIndividuelId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.state.set({
                                ...this.state(),
                                loading: false,
                                message: 'Demande individuel updated successfully',
                                error: undefined
                            });

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Selection effectuée avec Success',
                                life: 3000
                            });

                            // Navigate after 3 seconds (matching the message life duration)
                            setTimeout(() => {
                                this.router.navigate(['/dashboards/credit/individuel/attente']);
                            }, 2000);
                        },
                        error: (error) => {
                            this.state.set({
                                ...this.state(),
                                loading: false,
                                message: undefined,
                                error: 'Error updating demande individuel'
                            });

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
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
    // PREVIEW FUNCTIONALITY METHODS
    // ===============================

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

        // Set PDF preview state
        this.state.update((s) => ({
            ...s,
            selectedPDFDocument: document,
            pdfBlobUrl: document.doc || null,
            showPDFPreview: true
        }));

        // Automatically open in new tab as primary action
        if (document.doc) {
            window.open(document.doc, '_blank');
        }

        this.messageService.add({
            severity: 'info',
            summary: 'PDF ouvert',
            detail: "Le PDF s'ouvre dans un nouvel onglet",
            life: 3000
        });
    }

    /**
     * Ferme la dialog de prévisualisation
     */
    closePreviewDialog(): void {
        this.state.update((s) => ({
            ...s,
            showPreviewDialog: false,
            selectedDocumentForPreview: null
        }));
    }

    /**
     * Enhanced close method for PDF preview
     */
    closePDFPreview(): void {
        this.state.update((s) => ({
            ...s,
            showPDFPreview: false,
            selectedPDFDocument: null,
            pdfBlobUrl: null
        }));
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
     * Getters et setters pour le dialog de prévisualisation
     */
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

    /**
     * Cleanup resources
     */
    ngOnDestroy(): void {
        // Nettoyer l'URL PDF si elle existe et si c'est un blob
        const pdfUrl = this.state().pdfBlobUrl;
        if (pdfUrl && pdfUrl.startsWith('blob:')) {
            URL.revokeObjectURL(pdfUrl);
        }
    }
}
