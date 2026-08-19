import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { CreditosClienteResponseDTO } from '@/interface/CreditosClienteResponseDTO';
import { Personnecaution } from '@/interface/personnecaution';
import { IResponse } from '@/interface/response';
import { Selection } from '@/interface/selection';
import { IUser } from '@/interface/user';
import { Avis } from '@/interface/avis';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
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

/** Statut de chargement d'une donnée SAF (affichage toujours visible + message adapté). */
type SafStatus = 'loading' | 'ok' | 'empty' | 'error';

/** Ligne compacte de synthèse de trésorerie (une par période). */
interface TresorerieRow {
    periode: string;
    soldeDebut: number;
    totalEncaissements: number;
    totalDecaissements: number;
    excedentDeficit: number;
    echeancePrevue: number; // Intérêts à verser + Remboursement capital de la période
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
        RouterModule,
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
        farmer: any | null;
        comptes: any[];
        histoCredits: CreditosClienteResponseDTO | null;
        mouvementsResume: any[];
        farmerStatus: SafStatus;
        comptesStatus: SafStatus;
        histoStatus: SafStatus;
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
        farmer: null,
        comptes: [],
        histoCredits: null,
        mouvementsResume: [],
        farmerStatus: 'loading',
        comptesStatus: 'loading',
        histoStatus: 'loading',
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

                    // Synthese DG : donnees SAF liees au membre (codCliente = numeroMembre)
                    const codCliente = demande?.numeroMembre;
                    if (codCliente) {
                        this.loadAgriInfo(codCliente);
                        this.loadComptes(codCliente);
                        this.loadHistoCredits(codCliente);
                        this.loadMouvementsResume(codCliente);
                    } else {
                        this.state.update((s) => ({ ...s, farmerStatus: 'error', comptesStatus: 'error', histoStatus: 'error' }));
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

    /** Échéance prévue de la période = Intérêts à verser + Remboursement capital (lignes de décaissement). */
    private calculerEcheancePrevue(prevision: any): number {
        const lignes: any[] = prevision?.lignesDecaissement || [];
        return lignes
            .filter((l) => {
                const categorie = (l.categorie || '').toUpperCase();
                const libelle = (l.libelle || '').toLowerCase();
                return categorie === 'INTERETS' || categorie === 'CAPITAL'
                    || libelle.includes('intérêts à verser') || libelle.includes('remboursement capital');
            })
            .reduce((total, l) => total + (Number(l.montant) || 0), 0);
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
                            echeancePrevue: this.calculerEcheancePrevue(p),
                            soldeFin: p.soldeFin || 0
                        }));
                    this.state.update((s) => ({ ...s, tresorerie: rows }));
                },
                error: () => this.state.update((s) => ({ ...s, tresorerie: [] }))
            });
    }

    // ── Synthèse DG : SAF (ancienneté, épargne, historique crédits) ─────────────

    private loadAgriInfo(codCliente: string): void {
        this.userService
            .getAgriInfo$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const farmer = (response.data as any)?.farmer || null;
                    this.state.update((s) => ({ ...s, farmer, farmerStatus: farmer ? 'ok' : 'empty' }));
                },
                error: () => this.state.update((s) => ({ ...s, farmer: null, farmerStatus: 'error' }))
            });
    }

    private loadComptes(codCliente: string): void {
        this.userService
            .getComptesClient$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const comptes = (response.data as any)?.comptes;
                    const list = Array.isArray(comptes) ? comptes : [];
                    this.state.update((s) => ({ ...s, comptes: list, comptesStatus: list.length ? 'ok' : 'empty' }));
                },
                error: () => this.state.update((s) => ({ ...s, comptes: [], comptesStatus: 'error' }))
            });
    }

    private loadHistoCredits(codCliente: string): void {
        this.userService
            .getHistoCreditsSaf$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const histoCredits = (response.data as any)?.histoCredits || null;
                    const hasData = !!(histoCredits && (histoCredits.evaluationRisque || (histoCredits.creditos && histoCredits.creditos.length)));
                    this.state.update((s) => ({ ...s, histoCredits, histoStatus: hasData ? 'ok' : 'empty' }));
                },
                error: () => this.state.update((s) => ({ ...s, histoCredits: null, histoStatus: 'error' }))
            });
    }

    // ── Flux des mouvements (dépôts/retraits) par compte, 6 mois ────────────────
    expandedComptes: Record<string, boolean> = {};
    mouvementDetails: Record<string, any[]> = {};
    loadingDetail: Record<string, boolean> = {};

    private loadMouvementsResume(codCliente: string): void {
        this.userService
            .getMouvementsResume$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => this.state.update((s) => ({ ...s, mouvementsResume: (r.data as any)?.resume || [] })),
                error: () => this.state.update((s) => ({ ...s, mouvementsResume: [] }))
            });
    }

    numCuenta(compte: any): string {
        return compte?.NUM_CUENTA ?? compte?.comptePKId?.NUM_CUENTA ?? '';
    }

    /** 6 derniers mois au format YYYYMM (du plus ancien au plus récent). */
    private derniersMois(): string[] {
        const arr: string[] = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            arr.push(`${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
        return arr;
    }

    private resumeRows(numCuenta: string): any[] {
        return this.state().mouvementsResume.filter((r) => String(r.numCuenta) === String(numCuenta));
    }

    hasFlux(numCuenta: string): boolean {
        return this.resumeRows(numCuenta).length > 0;
    }

    getFluxTotals(numCuenta: string): { depots: number; retraits: number; net: number; nb: number } {
        const rows = this.resumeRows(numCuenta);
        const depots = rows.reduce((t, r) => t + (Number(r.totalDepots) || 0), 0);
        const retraits = rows.reduce((t, r) => t + (Number(r.totalRetraits) || 0), 0);
        const nb = rows.reduce((t, r) => t + (Number(r.nbOperations) || 0), 0);
        return { depots, retraits, net: depots - retraits, nb };
    }

    getMonthlySeries(numCuenta: string): { mois: string; depots: number; retraits: number }[] {
        const rows = this.resumeRows(numCuenta);
        const byMonth: Record<string, { depots: number; retraits: number }> = {};
        rows.forEach((r) => {
            byMonth[String(r.mois)] = { depots: Number(r.totalDepots) || 0, retraits: Number(r.totalRetraits) || 0 };
        });
        return this.derniersMois().map((m) => ({
            mois: `${m.substring(4)}/${m.substring(2, 4)}`,
            depots: byMonth[m]?.depots || 0,
            retraits: byMonth[m]?.retraits || 0
        }));
    }

    getFluxMax(numCuenta: string): number {
        const s = this.getMonthlySeries(numCuenta);
        return Math.max(1, ...s.map((x) => Math.max(x.depots, x.retraits)));
    }

    barHeight(value: number, max: number): number {
        return Math.max(value > 0 ? 4 : 0, Math.round((value / max) * 100));
    }

    toggleCompteDetail(numCuenta: string): void {
        const open = !this.expandedComptes[numCuenta];
        this.expandedComptes[numCuenta] = open;
        if (open && !this.mouvementDetails[numCuenta]) {
            this.loadingDetail[numCuenta] = true;
            this.userService
                .getMouvementsCompte$(numCuenta)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (r: IResponse) => {
                        this.mouvementDetails[numCuenta] = (r.data as any)?.mouvements || [];
                        this.loadingDetail[numCuenta] = false;
                    },
                    error: () => {
                        this.mouvementDetails[numCuenta] = [];
                        this.loadingDetail[numCuenta] = false;
                    }
                });
        }
    }

    isCompteExpanded(numCuenta: string): boolean {
        return !!this.expandedComptes[numCuenta];
    }
    getCompteDetail(numCuenta: string): any[] {
        return this.mouvementDetails[numCuenta] || [];
    }
    isLoadingDetail(numCuenta: string): boolean {
        return !!this.loadingDetail[numCuenta];
    }

    /** Message à afficher quand une section SAF n'a pas (encore) de données. */
    safMessage(status: SafStatus): string {
        switch (status) {
            case 'loading': return 'Chargement des données SAF…';
            case 'error': return 'Donnée SAF momentanément indisponible (connexion à la base bancaire).';
            case 'empty': return 'Aucune donnée trouvée au SAF pour ce membre.';
            default: return '';
        }
    }

    farmerStatus = () => this.state().farmerStatus;
    comptesStatus = () => this.state().comptesStatus;
    histoStatus = () => this.state().histoStatus;

    // Ancienneté (B1)
    hasAnciennete(): boolean {
        return !!this.state().farmer?.fecIngreso;
    }

    getFecIngreso(): string {
        const f = this.state().farmer?.fecIngreso;
        if (!f) return '';
        const d = this.parseDate(f);
        return d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    }

    getAncienneteAnnees(): number | null {
        const f = this.state().farmer?.fecIngreso;
        const d = f ? this.parseDate(f) : null;
        if (!d) return null;
        const diff = Date.now() - d.getTime();
        return Math.max(0, Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
    }

    getAncienneteMois(): number | null {
        const f = this.state().farmer?.fecIngreso;
        const d = f ? this.parseDate(f) : null;
        if (!d) return null;
        const now = new Date();
        return Math.max(0, (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()));
    }

    private parseDate(value: any): Date | null {
        if (!value) return null;
        // LocalDate peut arriver en "yyyy-MM-dd", en tableau [y,m,d] ou en Date
        if (Array.isArray(value) && value.length >= 3) return new Date(value[0], value[1] - 1, value[2]);
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }

    // Comptes d'épargne (B2)
    getComptes(): any[] {
        return this.state().comptes || [];
    }

    getSolde(compte: any, champ: string): number {
        const v = compte?.[champ];
        return typeof v === 'number' ? v : Number(v) || 0;
    }

    getTotalEpargne(): number {
        return this.getComptes().reduce((total, c) => total + this.getSolde(c, 'SAL_DISPONIBLE'), 0);
    }

    getNumCompte(compte: any): string {
        return compte?.comptePKId?.NUM_CUENTA ?? compte?.comptePKId?.num_cuenta ?? compte?.NUM_CUENTA ?? '—';
    }

    // Historique crédits + score (B3)
    getEvaluationRisque(): any | null {
        return this.state().histoCredits?.evaluationRisque || null;
    }

    getCreditsAnterieurs(): any[] {
        return this.state().histoCredits?.creditos || [];
    }

    getScoreSeverity(): 'success' | 'info' | 'warn' | 'danger' {
        const score = Number(this.getEvaluationRisque()?.scoreConfiance ?? 0);
        if (score >= 90) return 'success';
        if (score >= 75) return 'info';
        if (score >= 60) return 'warn';
        return 'danger';
    }

    // Comparatif ancien / actuel (B4)
    getDernierCredit(): any | null {
        const credits = this.getCreditsAnterieurs();
        if (!credits.length) return null;
        return credits
            .slice()
            .sort((a, b) => {
                const da = this.parseDate(a.fecApertura)?.getTime() ?? 0;
                const db = this.parseDate(b.fecApertura)?.getTime() ?? 0;
                return db - da;
            })[0];
    }

    formatDateShort(value: any): string {
        const d = this.parseDate(value);
        return d ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';
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
