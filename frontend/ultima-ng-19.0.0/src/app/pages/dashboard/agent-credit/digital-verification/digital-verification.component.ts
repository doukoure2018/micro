import { CompteInfo } from '@/interface/CompteInfo';
import { DernieresTransactionsCompte, TransactionCompte } from '@/interface/TransactionCompte';
import { FicheSignaletiqueWithSolde } from '@/interface/FicheSignaletiqueWithSolde';
import { Individuel } from '@/interface/individuel';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ActualiserDecodeurComponent } from './actualiser-decodeur/actualiser-decodeur.component';
@Component({
    selector: 'app-digital-verification',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, TableModule, TagModule, ToastModule, ProgressSpinnerModule, DividerModule, PanelModule, TabViewModule, ActualiserDecodeurComponent],
    templateUrl: './digital-verification.component.html',
    styleUrl: './digital-verification.component.scss'
})
export class DigitalVerificationComponent implements OnInit {
    @Input() user?: IUser;
    state = signal<{
        user?: IUser;
        individuel?: Individuel;
        ficheSignaletique?: FicheSignaletiqueWithSolde;
        loading: boolean;
        searching: boolean;
        message?: string;
        error?: string;
    }>({
        loading: false,
        searching: false,
        message: undefined,
        error: undefined
    });

    // ---- Confidentialité des soldes : masqués par défaut, révélés par compte ou globalement ----
    /** Comptes dont les soldes sont révélés (icône œil de la ligne). */
    soldesReveles = signal<Set<string>>(new Set());
    /** Révélation globale (cartes, totaux et toutes les lignes) ; se referme seule après 60 s. */
    toutReveler = signal(false);
    private minuteurRemasquage?: ReturnType<typeof setTimeout>;
    static readonly MONTANT_MASQUE = '•••••• GNF';
    static readonly DELAI_REMASQUAGE_MS = 60_000;

    // ---- Dernières transactions par compte (ligne dépliable) ----
    transactions = signal<Record<string, DernieresTransactionsCompte>>({});
    transactionsEnCours = signal<Set<string>>(new Set());
    transactionsErreur = signal<Record<string, string>>({});
    expandedRows: { [numCuenta: string]: boolean } = {};

    searchForm!: FormGroup;
    updateForm!: FormGroup;

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRoute = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.initializeForms();
        this.setupSearchListener();
        this.loadUserInfo();
    }

    initializeForms(): void {
        // Search form for client code
        this.searchForm = this.fb.group({
            codCliente: ['', [Validators.required, Validators.minLength(11)]]
        });

        // Update form for client information
        this.updateForm = this.fb.group({
            codCliente: [{ value: '', disabled: true }],
            nomCliente: ['', Validators.required],
            telPrincipal: [''],
            telOtro: [''],
            detDireccion: [''],
            codProvincia: [''],
            codActividad: [''],
            codProfesion: [''],
            indSexo: [''],
            estCivil: [''],
            typeHabit: [''],
            nbrEnfant: [0],
            district: [''],
            pays: [''],
            typePiece: [''],
            numId: [''],
            nomBeneficiario: [''],
            relacBeneficiario: ['']
        });
    }

    setupSearchListener(): void {
        // Auto-search when typing stops
        this.searchForm
            .get('codCliente')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                if (value && value.length >= 11) {
                    this.searchClient();
                }
            });
    }

    loadUserInfo(): void {
        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data?.user) {
                        this.state.update((s) => ({ ...s, user: response.data.user }));
                    }
                },
                error: (error) => {
                    console.error('Error loading user profile:', error);
                }
            });
    }

    searchClient(): void {
        if (this.state().searching) {
            return;
        }

        const codCliente = this.searchForm.get('codCliente')?.value;

        if (!codCliente) {
            this.showError('Veuillez saisir un code client');
            return;
        }

        this.state.update((s) => ({
            ...s,
            searching: true,
            error: undefined,
            ficheSignaletique: undefined
        }));
        this.reinitialiserConfidentialite();

        // Call the new endpoint with soldes
        this.userService
            .getFicheSignaletiqueWithSolde$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Response received:', response);

                    // The actual data is nested in response.data.data based on the Postman response
                    if (response?.data?.data) {
                        const ficheData = response.data.data as FicheSignaletiqueWithSolde;
                        console.log('Fiche data extracted:', ficheData);

                        this.state.update((s) => ({
                            ...s,
                            searching: false,
                            ficheSignaletique: ficheData,
                            error: undefined
                        }));

                        // Populate update form with client data
                        this.populateUpdateForm(ficheData);

                        // Show success with account summary
                        const metadata = response.data.metadata;
                        if (metadata) {
                            this.showSuccess(`Fiche signalétique récupérée - ${metadata.totalComptes} compte(s), Solde disponible: ${this.formatCurrency(ficheData.totalSoldeDisponible)}`);
                        } else {
                            this.showSuccess('Fiche signalétique récupérée avec succès');
                        }
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            searching: false,
                            error: 'Aucune donnée trouvée'
                        }));
                        this.showWarning('Aucune donnée trouvée pour ce client');
                    }
                },
                error: (error) => {
                    console.error('Error fetching fiche signalétique:', error);
                    this.state.update((s) => ({
                        ...s,
                        searching: false,
                        error: error.message || 'Erreur lors de la récupération des données'
                    }));
                    this.showError(error.message || 'Erreur lors de la récupération des données');
                }
            });
    }

    populateUpdateForm(data: any): void {
        this.updateForm.patchValue({
            codCliente: data.codCliente,
            nomCliente: data.nomCliente || data.nombreComplet,
            telPrincipal: data.telPrincipal,
            telOtro: data.telOtro,
            detDireccion: data.detDireccion,
            codProvincia: data.codProvincia,
            codActividad: data.codActividad,
            codProfesion: data.codProfesion,
            indSexo: data.indSexo,
            estCivil: data.estCivil,
            typeHabit: data.tenenciaVivienda,
            nbrEnfant: data.numHijos,
            district: data.codDistrito,
            pays: data.codPais,
            typePiece: data.codTipoId,
            numId: data.numId,
            nomBeneficiario: data.nomBeneficiario,
            relacBeneficiario: data.relacBeneficiario
        });
    }

    getTotalSoldeDisponible(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeDisponible || 0;
    }

    getTotalSoldeMoyen(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeMoyen || 0;
    }

    getTotalSoldeDisponibleMiddleware(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeDisponibleMiddleware || 0;
    }

    getTotalSoldeMoyenMiddleware(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeMoyenMiddleware || 0;
    }

    getEcartTotalDisponible(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.ecartTotalDisponible || 0;
    }

    getEcartTotalMoyen(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.ecartTotalMoyen || 0;
    }

    isRapprochementOk(): boolean {
        const fiche = this.state().ficheSignaletique;
        return fiche?.rapprochementGlobalOk ?? true;
    }

    getComptesAvecEcart(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.comptesAvecEcart || 0;
    }

    getComptes(): CompteInfo[] {
        const fiche = this.state().ficheSignaletique;
        return fiche?.comptes || [];
    }

    getStatutSeverity(indRelacion: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (indRelacion) {
            case 'A':
                return 'success';
            case 'I':
                return 'danger';
            case 'S':
                return 'warn';
            case 'C':
                return 'contrast';
            case 'E':
                return 'secondary';
            default:
                return 'info';
        }
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('fr-GN', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    formatDate(date: any): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR');
    }

    clearSearch(): void {
        this.searchForm.reset();
        this.updateForm.reset();
        this.reinitialiserConfidentialite();
        this.state.update((s) => ({
            ...s,
            ficheSignaletique: undefined,
            error: undefined
        }));
    }

    // ==================== CONFIDENTIALITÉ DES SOLDES ====================

    /** Les soldes de ce compte sont-ils lisibles (révélation de la ligne ou globale) ? */
    estRevele(numCuenta: string): boolean {
        return this.toutReveler() || this.soldesReveles().has(numCuenta);
    }

    basculerSolde(numCuenta: string): void {
        this.soldesReveles.update((s) => {
            const copie = new Set(s);
            copie.has(numCuenta) ? copie.delete(numCuenta) : copie.add(numCuenta);
            return copie;
        });
    }

    basculerToutReveler(): void {
        this.toutReveler() ? this.masquerTout() : this.revelerTout();
    }

    private revelerTout(): void {
        this.toutReveler.set(true);
        clearTimeout(this.minuteurRemasquage);
        this.minuteurRemasquage = setTimeout(() => this.masquerTout(), DigitalVerificationComponent.DELAI_REMASQUAGE_MS);
    }

    masquerTout(): void {
        clearTimeout(this.minuteurRemasquage);
        this.toutReveler.set(false);
        this.soldesReveles.set(new Set());
    }

    /** Montant d'une ligne du tableau : masqué tant que le compte n'est pas révélé. */
    montantCompte(valeur: number | undefined | null, numCuenta: string): string {
        return this.estRevele(numCuenta) ? this.formatCurrency(valeur as number) : DigitalVerificationComponent.MONTANT_MASQUE;
    }

    /** Montant global (cartes, comparaison, totaux) : masqué tant que la révélation globale n'est pas active. */
    montantGlobal(valeur: number | undefined | null): string {
        return this.toutReveler() ? this.formatCurrency(valeur as number) : DigitalVerificationComponent.MONTANT_MASQUE;
    }

    private reinitialiserConfidentialite(): void {
        this.masquerTout();
        this.transactions.set({});
        this.transactionsEnCours.set(new Set());
        this.transactionsErreur.set({});
        this.expandedRows = {};
    }

    // ==================== DERNIÈRES TRANSACTIONS ====================

    onRowExpand(event: { data: CompteInfo }): void {
        this.chargerTransactions(event.data);
    }

    chargerTransactions(compte: CompteInfo, forcer = false): void {
        const numCuenta = compte.numCuenta;
        const codCliente = this.state().ficheSignaletique?.codCliente;
        if (!codCliente || !numCuenta) return;
        if (!forcer && (this.transactions()[numCuenta] || this.transactionsEnCours().has(numCuenta))) return;

        this.transactionsEnCours.update((s) => new Set(s).add(numCuenta));
        this.transactionsErreur.update((e) => ({ ...e, [numCuenta]: '' }));

        this.userService
            .getDernieresTransactionsCompte$(codCliente, numCuenta)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const data = (response?.data as any)?.transactions as DernieresTransactionsCompte | undefined;
                    if (data) {
                        this.transactions.update((t) => ({ ...t, [numCuenta]: data }));
                    } else {
                        this.transactionsErreur.update((e) => ({ ...e, [numCuenta]: 'Aucune transaction retournée' }));
                    }
                    this.transactionsEnCours.update((s) => {
                        const copie = new Set(s);
                        copie.delete(numCuenta);
                        return copie;
                    });
                },
                error: (error) => {
                    const message = typeof error === 'string' ? error : error?.message || 'Impossible de charger les transactions';
                    this.transactionsErreur.update((e) => ({ ...e, [numCuenta]: message }));
                    this.transactionsEnCours.update((s) => {
                        const copie = new Set(s);
                        copie.delete(numCuenta);
                        return copie;
                    });
                }
            });
    }

    transactionsDe(numCuenta: string): DernieresTransactionsCompte | undefined {
        return this.transactions()[numCuenta];
    }

    chargementTransactions(numCuenta: string): boolean {
        return this.transactionsEnCours().has(numCuenta);
    }

    erreurTransactions(numCuenta: string): string {
        return this.transactionsErreur()[numCuenta] || '';
    }

    /** Montant d'une transaction : suit la révélation du compte, sinon le masquage serait contournable. */
    montantTransaction(t: TransactionCompte, numCuenta: string): string {
        return this.estRevele(numCuenta) ? this.formatCurrency(t.montant as number) : DigitalVerificationComponent.MONTANT_MASQUE;
    }

    sensLibelle(sens: string): string {
        switch (sens) {
            case 'DEPOT':
                return 'Dépôt';
            case 'RETRAIT':
                return 'Retrait';
            default:
                return '—';
        }
    }

    formatDateHeure(date: any): string {
        if (!date) return '-';
        return new Date(date).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    // Message service methods
    showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    }

    showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    }

    showWarning(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: message,
            life: 4000
        });
    }

    showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: message,
            life: 3000
        });
    }
}
