import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { Personnecaution } from '@/interface/personnecaution';
import { IResponse } from '@/interface/response';
import { Selection } from '@/interface/selection';
import { IUser } from '@/interface/user';
import { Avis } from '@/interface/avis';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { environment } from 'src/environments/environment';
import { ResumeAnalyseFinanciereComponent } from '../resume-analyse-financiere/resume-analyse-financiere.component';

/** Ligne compacte de synthèse de trésorerie (une par période). */
interface TresorerieRow {
    periode: string;
    soldeDebut: number;
    totalEncaissements: number;
    totalDecaissements: number;
    excedentDeficit: number;
    soldeFin: number;
}

/**
 * Vue de synthèse consolidée destinée à la Direction Exploitation (MANAGER + service DE).
 * Lecture seule : présentation, activités, garanties, synthèse bilan, synthèse trésorerie,
 * personnes caution, documents téléversés et avis hiérarchiques — plus impression du dossier.
 */
@Component({
    selector: 'app-synthese-de',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        TableModule,
        TagModule,
        ButtonModule,
        ProgressSpinnerModule,
        ToastModule,
        DividerModule,
        AvatarModule,
        DialogModule,
        ResumeAnalyseFinanciereComponent
    ],
    templateUrl: './synthese-de.component.html',
    styleUrl: './synthese-de.component.scss'
})
export class SyntheseDeComponent implements OnInit {
    @Input({ required: true }) demandeId!: number;

    state = signal<{
        demande?: DemandeIndividuel;
        garanties: any[];
        cautions: Personnecaution[];
        documents: Selection[];
        avisList: Avis[];
        user?: IUser;
        dossierId: number | null;
        hasDossier: boolean;
        hasBilan: boolean;
        tresorerie: TresorerieRow[];
        loading: boolean;
        error: string | null;
        showPreviewDialog: boolean;
        selectedDocument: Selection | null;
    }>({
        garanties: [],
        cautions: [],
        documents: [],
        avisList: [],
        dossierId: null,
        hasDossier: false,
        hasBilan: false,
        tresorerie: [],
        loading: true,
        error: null,
        showPreviewDialog: false,
        selectedDocument: null
    });

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private router = inject(Router);

    ngOnInit(): void {
        if (!this.demandeId) {
            this.state.update((s) => ({ ...s, loading: false, error: 'Identifiant de demande manquant' }));
            return;
        }
        this.loadDemande();
        this.loadCautions();
        this.loadDocuments();
        this.loadAvis();
    }

    // ── Chargement des données ────────────────────────────────────────────────

    private loadDemande(): void {
        this.userService
            .getDemandeWithGaranties$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const data = response.data as any;
                    const demande: DemandeIndividuel | undefined = data?.demandeIndividuel;
                    const dossierId = data?.hasDossierCredit && data?.dossierCredit ? data.dossierCredit.id : null;

                    this.state.update((s) => ({
                        ...s,
                        demande,
                        garanties: demande?.garanties || [],
                        user: data?.user,
                        dossierId,
                        hasDossier: !!dossierId,
                        loading: false
                    }));

                    if (dossierId) {
                        this.loadTresorerie(dossierId);
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, loading: false, error: error?.message || 'Erreur lors du chargement de la demande' }));
                }
            });

        // La synthèse du bilan est chargée par le composant enfant resume-analyse.
        // On sonde ici uniquement pour savoir si un bilan existe (afficher/masquer la section).
        this.userService
            .getSyntheseAnalyseFinanciere$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const hasBilan = !!(response.data as any)?.synthese;
                    this.state.update((s) => ({ ...s, hasBilan }));
                },
                error: () => this.state.update((s) => ({ ...s, hasBilan: false }))
            });
    }

    private loadCautions(): void {
        this.userService
            .getPersonnesCautionByDemande$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({ ...s, cautions: (response.data as any)?.personnesCaution || [] }));
                },
                error: () => this.state.update((s) => ({ ...s, cautions: [] }))
            });
    }

    private loadDocuments(): void {
        this.userService
            .getAllDocuments$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((s) => ({ ...s, documents: response.data?.documents || [] }));
                },
                error: () => this.state.update((s) => ({ ...s, documents: [] }))
            });
    }

    private loadAvis(): void {
        this.userService
            .getAvisByDemande$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const avisList = response.data?.avis;
                    this.state.update((s) => ({ ...s, avisList: Array.isArray(avisList) ? avisList : avisList ? [avisList] : [] }));
                },
                error: () => this.state.update((s) => ({ ...s, avisList: [] }))
            });
    }

    private loadTresorerie(dossierId: number): void {
        this.userService
            .getPrevisionsTresorerie$(dossierId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const previsions: any[] = response.data?.previsions || [];
                    const rows: TresorerieRow[] = previsions
                        .slice()
                        .sort((a, b) => (a.numeroMois ?? 0) - (b.numeroMois ?? 0))
                        .map((p) => ({
                            periode: `P${p.numeroMois ?? 0}`,
                            soldeDebut: p.soldeDebut || 0,
                            totalEncaissements: p.totalEncaissements || 0,
                            totalDecaissements: p.totalDecaissements || 0,
                            excedentDeficit: p.excedentDeficit || 0,
                            soldeFin: p.soldeFin || 0
                        }));
                    this.state.update((s) => ({ ...s, tresorerie: rows }));
                },
                error: () => this.state.update((s) => ({ ...s, tresorerie: [] }))
            });
    }

    // ── Garanties ─────────────────────────────────────────────────────────────

    getTotalGaranties(): number {
        return this.state().garanties.reduce((total, g) => total + (g.valeurGarantie || 0), 0);
    }

    /** Financière / Autre => 100% de la valeur ; sinon 75% (caution solidaire, matériel). */
    getValeurEmprunte(garantie: { typeGarantie?: string; valeurGarantie?: number }): number {
        const valeur = garantie.valeurGarantie || 0;
        const pleineValeur = ['Garantie Financiere', 'Autre Garantie'];
        return pleineValeur.includes(garantie.typeGarantie ?? '') ? valeur : valeur * 0.75;
    }

    getTotalEmprunte(): number {
        return this.state().garanties.reduce((total, g) => total + this.getValeurEmprunte(g), 0);
    }

    // ── Trésorerie (cumuls) ─────────────────────────────────────────────────────

    getTresorerieCumul(champ: keyof TresorerieRow): number {
        return this.state().tresorerie.reduce((total, r) => total + (Number(r[champ]) || 0), 0);
    }

    getSoldeFinFinal(): number {
        const rows = this.state().tresorerie;
        return rows.length ? rows[rows.length - 1].soldeFin : 0;
    }

    // ── Documents ───────────────────────────────────────────────────────────────

    /**
     * Reconstruit l'URL publique d'un fichier à partir de la valeur stockée en base
     * (mêmes contraintes que la page détail : URL absolue backend inexploitable côté
     * navigateur). On ne garde que le nom de fichier et on rebâtit sur l'API courante.
     */
    getFileUrl(doc?: string | null): string {
        if (!doc) return '';
        if (doc.startsWith('data:') || doc.startsWith('blob:')) return doc;

        // Préserver le segment d'origine (/files/ ou /docs/), tous deux servis par le backend.
        const match = doc.match(/\/(files|docs)\/(.+)$/i);
        let segment = 'files';
        let fileName: string;
        if (match) {
            segment = match[1].toLowerCase();
            fileName = match[2];
        } else {
            fileName = doc.substring(doc.lastIndexOf('/') + 1);
        }
        fileName = fileName.split('?')[0].split('#')[0];
        if (!fileName) return doc;
        return `${environment.apiBaseUrl}/ecredit/${segment}/${fileName}`;
    }

    isImageDocument(doc: Selection): boolean {
        if (!doc.doc) return false;
        const url = doc.doc.toLowerCase();
        return url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg') || url.includes('.gif');
    }

    isPDFDocument(doc: Selection): boolean {
        return !!doc.doc && doc.doc.toLowerCase().includes('.pdf');
    }

    getDocumentExtension(doc: Selection): string {
        if (!doc.doc) return 'FILE';
        const url = doc.doc.toLowerCase();
        if (url.includes('.pdf')) return 'PDF';
        if (url.includes('.png')) return 'PNG';
        if (url.includes('.jpg') || url.includes('.jpeg')) return 'JPG';
        if (url.includes('.gif')) return 'GIF';
        return 'FILE';
    }

    viewDocument(doc: Selection): void {
        if (this.isImageDocument(doc)) {
            this.state.update((s) => ({ ...s, selectedDocument: doc, showPreviewDialog: true }));
        } else {
            const url = this.getFileUrl(doc.doc);
            if (url) window.open(url, '_blank');
        }
    }

    closePreviewDialog(): void {
        this.state.update((s) => ({ ...s, showPreviewDialog: false, selectedDocument: null }));
    }

    openInNewTab(url?: string): void {
        if (url) window.open(url, '_blank');
    }

    // ── Formatage ─────────────────────────────────────────────────────────────

    formatCurrency(amount: number | null | undefined): string {
        if (amount === null || amount === undefined) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'GNF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
    }

    formatDate(date: Date | string | undefined): string {
        if (!date) return '';
        return new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // ── Impression ─────────────────────────────────────────────────────────────

    imprimer(): void {
        // Le marqueur sur <body> active des règles @media print globales qui masquent
        // la coquille de l'application (topbar, sidebar, breadcrumb…) pendant l'impression.
        document.body.classList.add('printing-synthese-de');
        const cleanup = () => {
            document.body.classList.remove('printing-synthese-de');
            window.removeEventListener('afterprint', cleanup);
        };
        window.addEventListener('afterprint', cleanup);
        window.print();
    }

    goBack(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente']);
    }
}
