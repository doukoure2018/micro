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
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { catchError, EMPTY, forkJoin, Observer, of, switchMap } from 'rxjs';

@Component({
    selector: 'app-import-selection',
    imports: [CommonModule, ToastModule, CardModule, ProgressSpinnerModule, MessageModule, FileUploadModule, ButtonModule, ImageModule, TableModule, ConfirmDialogModule],
    templateUrl: './import-selection.component.html',
    styles: `
        .container {
            max-width: 600px;
            margin: 2rem auto;
            padding: 1rem;
        }

        .preview-container {
            text-align: center;
            border: 1px solid #ddd;
            padding: 1rem;
            border-radius: 4px;
        }

        .preview-image {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
        }

        .file-preview {
            font-size: 1.5rem;
            color: #666;
        }

        .file-preview i {
            margin-right: 0.5rem;
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
    }>({
        loading: false,
        error: null,
        selectedFiles: [],
        previews: [],
        document: null,
        documents: null,
        demandeIndividuel: null,
        demandeindividuel_id: null,
        userId: null
    });

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

    deleteDocument(document: Selection): void {
        if (!document || !document.selectionId || !this.state().demandeindividuel_id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Cannot delete document: Missing required information'
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
                        // Remove the deleted document from the list
                        documents: s.documents?.filter((doc) => doc.selectionId !== document.selectionId) || null
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Document deleted successfully'
                    });
                },
                error: (err) => {
                    this.state.update((s) => ({ ...s, loading: false, error: err.message || 'Failed to delete document' }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Delete Failed',
                        detail: err.message || 'Error deleting document'
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

    onFileSelect(event: any): void {
        const files = event.files;
        if (files && files.length > 0) {
            const newPreviews: { file: File; url: string; width?: number; height?: number }[] = [];
            const newFiles: File[] = [];

            for (const file of files) {
                const previewObj: { file: File; url: string; width?: number; height?: number } = {
                    file: file,
                    url: URL.createObjectURL(file)
                };

                newPreviews.push(previewObj);
                newFiles.push(file);

                // If it's an image, get dimensions
                if (file.type.includes('image')) {
                    const img = new Image();
                    img.onload = () => {
                        this.state.update((s) => {
                            const updatedPreviews = s.previews.map((p) => {
                                if (p.file === file) {
                                    return { ...p, width: img.width, height: img.height };
                                }
                                return p;
                            });

                            return {
                                ...s,
                                previews: updatedPreviews
                            };
                        });
                    };
                    img.src = previewObj.url;
                }
            }

            this.state.update((s) => ({
                ...s,
                selectedFiles: [...s.selectedFiles, ...newFiles],
                previews: [...s.previews, ...newPreviews]
            }));
        }
    }

    removeFile(index: number): void {
        this.state.update((s) => {
            const newSelectedFiles = [...s.selectedFiles];
            const newPreviews = [...s.previews];

            // Release the object URL to prevent memory leaks
            URL.revokeObjectURL(newPreviews[index].url);

            // Remove the file and preview
            newSelectedFiles.splice(index, 1);
            newPreviews.splice(index, 1);

            return {
                ...s,
                selectedFiles: newSelectedFiles,
                previews: newPreviews
            };
        });
    }

    uploadDocuments(): void {
        const { selectedFiles, userId, demandeindividuel_id } = this.state();

        if (selectedFiles.length === 0 || !userId || !demandeindividuel_id) {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Please select files and ensure valid parameters'
            });
            return;
        }

        this.state.update((s) => ({ ...s, loading: true, error: null }));

        // Create an array to track upload promises
        const uploadPromises = selectedFiles.map((file) => {
            const formData = new FormData();
            formData.append('image', file);

            return this.userService.addDocuments$(userId, demandeindividuel_id, formData).pipe(
                takeUntilDestroyed(this.destroyRef),
                catchError((error) => {
                    // Handle individual file upload error
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Upload Failed',
                        detail: `Failed to upload ${file.name}: ${error.message || 'Unknown error'}`
                    });
                    return of(null); // Return observable that completes without error
                })
            );
        });

        // Use forkJoin to wait for all uploads to complete
        forkJoin(uploadPromises)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (responses) => {
                    // Count successful uploads
                    const successCount = responses.filter((r) => r !== null).length;

                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        selectedFiles: [],
                        previews: []
                    }));

                    if (successCount > 0) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success',
                            detail: `${successCount} document(s) uploaded successfully`
                        });

                        // Refresh document list
                        this.loadDemandeDocument();
                    }
                },
                error: (err) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: err.message || 'Failed to upload documents'
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Upload Failed',
                        detail: err.message || 'Error uploading documents'
                    });
                }
            });
    }
}
