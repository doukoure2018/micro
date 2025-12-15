import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentCartePrepaidDto, EtatDocumentDetailDto, StatutDocument } from '@/interface/etat-document.model';
import { UserService } from '@/service/user.service';

interface State {
    etat: EtatDocumentDetailDto | null;
    loading: boolean;
    processing: boolean;
    error: string | null;
    success: string | null;
    selectedImage: string | null;
    showRejectModal: boolean;
    rejectMotif: string;
}

@Component({
    selector: 'app-document-detail',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './document-detail.component.html',
    styleUrls: ['./document-detail.component.scss'],
    providers: [UserService]
})
export class DocumentDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private userService = inject(UserService);

    state = signal<State>({
        etat: null,
        loading: false,
        processing: false,
        error: null,
        success: null,
        selectedImage: null,
        showRejectModal: false,
        rejectMotif: ''
    });

    ngOnInit(): void {
        const etatId = this.route.snapshot.params['id'];
        if (etatId) {
            this.loadDetail(+etatId);
        }
    }

    async loadDetail(etatId: number): Promise<void> {
        this.updateState({ loading: true, error: null });

        try {
            const response = await this.userService.getEtatDocumentDetail$(etatId).toPromise();
            if (response?.data?.etat) {
                this.updateState({ etat: response.data.etat as EtatDocumentDetailDto });
            }
        } catch (error: any) {
            this.updateState({ error: error?.message || 'Erreur lors du chargement' });
        } finally {
            this.updateState({ loading: false });
        }
    }

    async valider(): Promise<void> {
        const { etat } = this.state();
        if (!etat) return;

        this.updateState({ processing: true, error: null, success: null });

        try {
            const response = await this.userService.validerEtatDocument$(etat.id).toPromise();
            if (response?.data?.etat) {
                this.updateState({
                    etat: { ...etat, statut: 'VALIDE' as StatutDocument },
                    success: 'Document validé avec succès'
                });
                // Recharger les détails
                setTimeout(() => this.loadDetail(etat.id), 1000);
            }
        } catch (error: any) {
            this.updateState({ error: error?.message || 'Erreur lors de la validation' });
        } finally {
            this.updateState({ processing: false });
        }
    }

    async accepter(): Promise<void> {
        const { etat } = this.state();
        if (!etat) return;

        this.updateState({ processing: true, error: null, success: null });

        try {
            const response = await this.userService.accepterEtatDocument$(etat.id).toPromise();
            if (response?.data?.etat) {
                this.updateState({
                    etat: { ...etat, statut: 'ACCEPTE' as StatutDocument },
                    success: 'Document accepté avec succès'
                });
                setTimeout(() => this.loadDetail(etat.id), 1000);
            }
        } catch (error: any) {
            this.updateState({ error: error?.message || "Erreur lors de l'acceptation" });
        } finally {
            this.updateState({ processing: false });
        }
    }

    openRejectModal(): void {
        this.updateState({ showRejectModal: true, rejectMotif: '' });
    }

    closeRejectModal(): void {
        this.updateState({ showRejectModal: false, rejectMotif: '' });
    }

    async rejeter(): Promise<void> {
        const { etat, rejectMotif } = this.state();
        if (!etat) return;

        this.updateState({ processing: true, error: null, success: null });

        try {
            const response = await this.userService.rejeterEtatDocument$(etat.id, rejectMotif).toPromise();
            if (response?.data?.etat) {
                this.updateState({
                    etat: { ...etat, statut: 'REJET' as StatutDocument },
                    success: 'Document rejeté',
                    showRejectModal: false
                });
                setTimeout(() => this.loadDetail(etat.id), 1000);
            }
        } catch (error: any) {
            this.updateState({ error: error?.message || 'Erreur lors du rejet' });
        } finally {
            this.updateState({ processing: false });
        }
    }

    openImage(imageUrl: string): void {
        this.updateState({ selectedImage: imageUrl });
    }

    closeImage(): void {
        this.updateState({ selectedImage: null });
    }

    goBack(): void {
        this.router.navigate(['/dashboards/document-verification']);
    }

    getStatutClass(statut: StatutDocument): string {
        const classes: Record<StatutDocument, string> = {
            ENCOURS: 'status-warning',
            VALIDE: 'status-info',
            ACCEPTE: 'status-success',
            REJET: 'status-danger'
        };
        return classes[statut] || 'status-secondary';
    }

    getStatutLabel(statut: StatutDocument): string {
        const labels: Record<StatutDocument, string> = {
            ENCOURS: 'En cours',
            VALIDE: 'Validé',
            ACCEPTE: 'Accepté',
            REJET: 'Rejeté'
        };
        return labels[statut] || statut;
    }

    canValidate(): boolean {
        return this.state().etat?.statut === 'ENCOURS';
    }

    canAccept(): boolean {
        return this.state().etat?.statut === 'VALIDE';
    }

    canReject(): boolean {
        const statut = this.state().etat?.statut;
        return statut === 'ENCOURS' || statut === 'VALIDE';
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getFileExtension(url: string): string {
        if (!url) return '';
        const parts = url.split('.');
        return parts[parts.length - 1].toLowerCase();
    }

    isImage(url: string): boolean {
        const ext = this.getFileExtension(url);
        return ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext);
    }

    getFileName(url: string): string {
        if (!url) return 'Document';
        const parts = url.split('/');
        return parts[parts.length - 1];
    }

    private updateState(partial: Partial<State>): void {
        this.state.update((current) => ({ ...current, ...partial }));
    }

    updateRejectMotif(event: Event): void {
        const input = event.target as HTMLTextAreaElement;
        this.updateState({ rejectMotif: input.value });
    }

    /**
     * Télécharger un document
     */
    async downloadDocument(doc: DocumentCartePrepaidDto): Promise<void> {
        try {
            const response = await fetch(doc.doc);
            const blob = await response.blob();

            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = this.getFileName(doc.doc);

            // Déclencher le téléchargement
            document.body.appendChild(link);
            link.click();

            // Nettoyer
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
            this.updateState({ error: 'Erreur lors du téléchargement du document' });
        }
    }

    /**
     * Télécharger tous les documents
     */
    async downloadAllDocuments(): Promise<void> {
        const { etat } = this.state();
        if (!etat?.documents || etat.documents.length === 0) return;

        this.updateState({ processing: true });

        try {
            for (const doc of etat.documents) {
                await this.downloadDocument(doc);
                // Petit délai entre chaque téléchargement
                await new Promise((resolve) => setTimeout(resolve, 500));
            }
            this.updateState({ success: `${etat.documents.length} document(s) téléchargé(s)` });
        } catch (error) {
            this.updateState({ error: 'Erreur lors du téléchargement des documents' });
        } finally {
            this.updateState({ processing: false });
        }
    }
}
