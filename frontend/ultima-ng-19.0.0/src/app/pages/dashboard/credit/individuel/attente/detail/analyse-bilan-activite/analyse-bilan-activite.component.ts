import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { PointVente } from '@/interface/point.vente';
import { CommonModule, CurrencyPipe, DecimalPipe, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, DestroyRef, inject, signal, computed, LOCALE_ID } from '@angular/core';

// Register French locale
registerLocaleData(localeFr, 'fr-FR');
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { Personnecaution } from '@/interface/personnecaution';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface ComponentState {
    loading: boolean;
    allDelegations: Delegation[];
    allAgences: Agence[];
    allPointsVente: PointVente[];
    filteredAgences: Agence[];
    filteredPointsVente: PointVente[];
    demandeIndividuel: any;
    userId: number | null;
    analyseId: number | null;
    analyseExiste: boolean;
}

interface RatioInfo {
    code: string;
    nom: string;
    operateur: string;
    norme: number;
    normeDisplay: string;
    sollicite: number | null;
    propose: number | null;
    conformeSollicite: boolean;
    conformePropose: boolean;
}

@Component({
    selector: 'app-analyse-bilan-activite',
    imports: [
        CommonModule,
        TextareaModule,
        InputGroupModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        StepsModule,
        CardModule,
        ToastModule,
        TagModule,
        BadgeModule,
        CurrencyPipe,
        DecimalPipe,
        TableModule,
        PanelModule,
        DividerModule,
        TooltipModule,
        DatePickerModule,
        SelectModule
    ],
    templateUrl: './analyse-bilan-activite.component.html',
    styleUrl: './analyse-bilan-activite.component.scss',
    providers: [MessageService, { provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class AnalyseBilanActiviteComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);

    private apiUrl = environment.apiBaseUrl;

    state = signal<ComponentState>({
        loading: false,
        allDelegations: [],
        allAgences: [],
        allPointsVente: [],
        filteredAgences: [],
        filteredPointsVente: [],
        demandeIndividuel: null,
        userId: null,
        analyseId: null,
        analyseExiste: false
    });

    activeIndex = signal<number>(0);
    items = signal<MenuItem[]>([]);
    loading = signal<boolean>(false);
    savingBilan = signal<boolean>(false);
    savingRentabilite = signal<boolean>(false);
    savingBesoinCredit = signal<boolean>(false);
    calculatingRatios = signal<boolean>(false);

    // Flags pour savoir si les données ont été enregistrées (pour afficher Modifier)
    bilanSaved = signal<boolean>(false);
    rentabiliteSaved = signal<boolean>(false);
    besoinCreditSaved = signal<boolean>(false);

    // Forms
    bilanNForm!: FormGroup; // Bilan année N
    bilanN1Form!: FormGroup; // Bilan année N-1
    rentabiliteNForm!: FormGroup; // Rentabilité année N
    rentabiliteN1Form!: FormGroup; // Rentabilité année N-1
    rentabiliteN2Form!: FormGroup; // Rentabilité prévisionnel N+1
    besoinCreditForm!: FormGroup;
    propositionForm!: FormGroup;
    demandeCreditForm!: FormGroup;
    personnecautionForm!: FormGroup;

    // Ratios data
    ratiosData = signal<RatioInfo[]>([]);

    // Signal pour déclencher le recalcul des computed values quand le formulaire change
    private formChangeCounter = signal<number>(0);

    personnecautions: Personnecaution[] = [];
    demandeIndividuelId: number | null = null;

    // Periodicités disponibles
    periodicites = [
        { label: 'Mensuelle', value: 'MENSUELLE', facteur: 1 },
        { label: 'Bimestrielle', value: 'BIMESTRIELLE', facteur: 2 },
        { label: 'Trimestrielle', value: 'TRIMESTRIELLE', facteur: 3 },
        { label: 'Quadrimestrielle', value: 'QUADRIMESTRIELLE', facteur: 4 },
        { label: 'Semestrielle', value: 'SEMESTRIELLE', facteur: 6 },
        { label: 'Annuelle', value: 'ANNUELLE', facteur: 12 },
        { label: 'Unique', value: 'UNIQUE', facteur: 1 }
    ];

    // ============== COMPUTED VALUES FOR BILAN ==============
    // Note: formChangeCounter force le recalcul quand le formulaire change

    // Bilan N - ACTIF
    totalActifImmobiliseN = computed(() => {
        this.formChangeCounter(); // Dépendance pour forcer le recalcul
        const form = this.bilanNForm;
        if (!form) return 0;
        return (
            (form.get('terrains')?.value || 0) +
            (form.get('constructions')?.value || 0) +
            (form.get('installationsTechniques')?.value || 0) +
            (form.get('materielTransport')?.value || 0) +
            (form.get('materielBureau')?.value || 0) +
            (form.get('autresImmobilisations')?.value || 0) +
            (form.get('immobilisationsEnCours')?.value || 0) +
            (form.get('immobilisationsFinancieres')?.value || 0)
        );
    });

    totalActifCirculantN = computed(() => {
        this.formChangeCounter(); // Dépendance pour forcer le recalcul
        const form = this.bilanNForm;
        if (!form) return 0;
        return (form.get('stocks')?.value || 0) + (form.get('creances')?.value || 0) + (form.get('tresorerieActif')?.value || 0);
    });

    totalActifN = computed(() => {
        this.formChangeCounter();
        return this.totalActifImmobiliseN() + this.totalActifCirculantN();
    });

    // Total Bilan = Total Actif (Actif = Passif)
    totalBilanN = computed(() => {
        this.formChangeCounter();
        return this.totalActifN();
    });

    // Bilan N - PASSIF
    capitauxPropresN = computed(() => {
        this.formChangeCounter();
        // Si capitauxPropre est saisi, utiliser cette valeur, sinon calculer
        const capitauxPropreSaisi = this.bilanNForm?.get('capitauxPropre')?.value || 0;
        if (capitauxPropreSaisi > 0) {
            return capitauxPropreSaisi;
        }
        // Capitaux propres = Total Actif - Dettes
        const totalDettes = (this.bilanNForm?.get('dettesLongTerme')?.value || 0) + (this.bilanNForm?.get('dettesCourtTerme')?.value || 0) + (this.bilanNForm?.get('tresoreriePassif')?.value || 0);
        return this.totalActifN() - totalDettes;
    });

    totalPassifN = computed(() => {
        this.formChangeCounter();
        const form = this.bilanNForm;
        if (!form) return 0;
        return this.capitauxPropresN() + (form.get('dettesLongTerme')?.value || 0) + (form.get('dettesCourtTerme')?.value || 0) + (form.get('tresoreriePassif')?.value || 0);
    });

    fondsRoulementN = computed(() => {
        this.formChangeCounter();
        return this.capitauxPropresN() + (this.bilanNForm?.get('dettesLongTerme')?.value || 0) - this.totalActifImmobiliseN();
    });

    besoinFondsRoulementN = computed(() => {
        this.formChangeCounter();
        const stocks = this.bilanNForm?.get('stocks')?.value || 0;
        const creances = this.bilanNForm?.get('creances')?.value || 0;
        const dettesCourtTerme = this.bilanNForm?.get('dettesCourtTerme')?.value || 0;
        return stocks + creances - dettesCourtTerme;
    });

    tresorerieNetteN = computed(() => {
        this.formChangeCounter();
        return this.fondsRoulementN() - this.besoinFondsRoulementN();
    });

    // ============== COMPUTED VALUES FOR BILAN N-1 ==============

    // Bilan N-1 - ACTIF
    totalActifImmobiliseN1 = computed(() => {
        this.formChangeCounter();
        const form = this.bilanN1Form;
        if (!form) return 0;
        return (
            (form.get('terrains')?.value || 0) +
            (form.get('constructions')?.value || 0) +
            (form.get('installationsTechniques')?.value || 0) +
            (form.get('materielTransport')?.value || 0) +
            (form.get('materielBureau')?.value || 0) +
            (form.get('autresImmobilisations')?.value || 0) +
            (form.get('immobilisationsEnCours')?.value || 0) +
            (form.get('immobilisationsFinancieres')?.value || 0)
        );
    });

    totalActifCirculantN1 = computed(() => {
        this.formChangeCounter();
        const form = this.bilanN1Form;
        if (!form) return 0;
        return (form.get('stocks')?.value || 0) + (form.get('creances')?.value || 0) + (form.get('tresorerieActif')?.value || 0);
    });

    totalActifN1 = computed(() => {
        this.formChangeCounter();
        return this.totalActifImmobiliseN1() + this.totalActifCirculantN1();
    });

    // Total Bilan N-1
    totalBilanN1 = computed(() => {
        this.formChangeCounter();
        return this.totalActifN1();
    });

    // Bilan N-1 - PASSIF
    capitauxPropresN1 = computed(() => {
        this.formChangeCounter();
        // Si capitauxPropre est saisi, utiliser cette valeur, sinon calculer
        const capitauxPropreSaisi = this.bilanN1Form?.get('capitauxPropre')?.value || 0;
        if (capitauxPropreSaisi > 0) {
            return capitauxPropreSaisi;
        }
        const totalDettes = (this.bilanN1Form?.get('dettesLongTerme')?.value || 0) + (this.bilanN1Form?.get('dettesCourtTerme')?.value || 0) + (this.bilanN1Form?.get('tresoreriePassif')?.value || 0);
        return this.totalActifN1() - totalDettes;
    });

    totalPassifN1 = computed(() => {
        this.formChangeCounter();
        const form = this.bilanN1Form;
        if (!form) return 0;
        return this.capitauxPropresN1() + (form.get('dettesLongTerme')?.value || 0) + (form.get('dettesCourtTerme')?.value || 0) + (form.get('tresoreriePassif')?.value || 0);
    });

    fondsRoulementN1 = computed(() => {
        this.formChangeCounter();
        return this.capitauxPropresN1() + (this.bilanN1Form?.get('dettesLongTerme')?.value || 0) - this.totalActifImmobiliseN1();
    });

    besoinFondsRoulementN1 = computed(() => {
        this.formChangeCounter();
        const stocks = this.bilanN1Form?.get('stocks')?.value || 0;
        const creances = this.bilanN1Form?.get('creances')?.value || 0;
        const dettesCourtTerme = this.bilanN1Form?.get('dettesCourtTerme')?.value || 0;
        return stocks + creances - dettesCourtTerme;
    });

    tresorerieNetteN1 = computed(() => {
        this.formChangeCounter();
        return this.fondsRoulementN1() - this.besoinFondsRoulementN1();
    });

    // ============== COMPUTED VALUES FOR RENTABILITE ==============
    // Note: formChangeCounter() force le recalcul quand le formulaire change

    // Rentabilité N
    margeBruteN = computed(() => {
        this.formChangeCounter(); // Dépendance pour forcer le recalcul
        const ca = this.rentabiliteNForm?.get('chiffreAffaires')?.value || 0;
        const coutAchats = this.rentabiliteNForm?.get('coutAchatMarchandises')?.value || 0;
        return ca - coutAchats;
    });

    // Total des 13 charges d'exploitation (sans amortissements)
    totalChargesN = computed(() => {
        this.formChangeCounter();
        const form = this.rentabiliteNForm;
        if (!form) return 0;
        return (
            (form.get('salaires')?.value || 0) +
            (form.get('prelevementEntrepreneur')?.value || 0) +
            (form.get('loyers')?.value || 0) +
            (form.get('transport')?.value || 0) +
            (form.get('electriciteEauTelephone')?.value || 0) +
            (form.get('fournituresAutresBesoins')?.value || 0) +
            (form.get('entretienReparation')?.value || 0) +
            (form.get('carburantLubrifiants')?.value || 0) +
            (form.get('publicitePromotion')?.value || 0) +
            (form.get('impotsTaxes')?.value || 0) +
            (form.get('fraisBancairesInterets')?.value || 0) +
            (form.get('echeanceAutreCredit')?.value || 0) +
            (form.get('diversesCharges')?.value || 0)
        );
    });

    // Amortissements et provisions
    amortissementsN = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteNForm?.get('amortissementsProvisions')?.value || 0;
    });

    // Autres revenus hors activité
    autresRevenusN = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteNForm?.get('autresRevenusHorsActivite')?.value || 0;
    });

    resultatExploitationN = computed(() => {
        this.formChangeCounter();
        const margeBrute = this.margeBruteN();
        const totalCharges = this.totalChargesN();
        const amortissements = this.amortissementsN();
        // Résultat = Marge brute - Charges - Amortissements (autres revenus ajoutés après cash-flow)
        return margeBrute - totalCharges - amortissements;
    });

    cashFlowN = computed(() => {
        this.formChangeCounter();
        // Cash-flow = Résultat d'exploitation + Amortissements
        return this.resultatExploitationN() + this.amortissementsN();
    });

    // Résultat net (après autres revenus) - affiché après Cash-flow
    resultatNetN = computed(() => {
        this.formChangeCounter();
        return this.cashFlowN() + this.autresRevenusN();
    });

    tauxMargeBruteN = computed(() => {
        this.formChangeCounter();
        const ca = this.rentabiliteNForm?.get('chiffreAffaires')?.value || 0;
        if (ca === 0) return 0;
        return (this.margeBruteN() / ca) * 100;
    });

    // ============== COMPUTED VALUES FOR RENTABILITE N-1 ==============

    margeBruteN1 = computed(() => {
        this.formChangeCounter();
        const ca = this.rentabiliteN1Form?.get('chiffreAffaires')?.value || 0;
        const coutAchats = this.rentabiliteN1Form?.get('coutAchatMarchandises')?.value || 0;
        return ca - coutAchats;
    });

    // Total des 13 charges d'exploitation N-1 (sans amortissements)
    totalChargesN1 = computed(() => {
        this.formChangeCounter();
        const form = this.rentabiliteN1Form;
        if (!form) return 0;
        return (
            (form.get('salaires')?.value || 0) +
            (form.get('prelevementEntrepreneur')?.value || 0) +
            (form.get('loyers')?.value || 0) +
            (form.get('transport')?.value || 0) +
            (form.get('electriciteEauTelephone')?.value || 0) +
            (form.get('fournituresAutresBesoins')?.value || 0) +
            (form.get('entretienReparation')?.value || 0) +
            (form.get('carburantLubrifiants')?.value || 0) +
            (form.get('publicitePromotion')?.value || 0) +
            (form.get('impotsTaxes')?.value || 0) +
            (form.get('fraisBancairesInterets')?.value || 0) +
            (form.get('echeanceAutreCredit')?.value || 0) +
            (form.get('diversesCharges')?.value || 0)
        );
    });

    // Amortissements N-1
    amortissementsN1 = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteN1Form?.get('amortissementsProvisions')?.value || 0;
    });

    // Autres revenus N-1
    autresRevenusN1 = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteN1Form?.get('autresRevenusHorsActivite')?.value || 0;
    });

    resultatExploitationN1 = computed(() => {
        this.formChangeCounter();
        const margeBrute = this.margeBruteN1();
        const totalCharges = this.totalChargesN1();
        const amortissements = this.amortissementsN1();
        return margeBrute - totalCharges - amortissements;
    });

    cashFlowN1 = computed(() => {
        this.formChangeCounter();
        return this.resultatExploitationN1() + this.amortissementsN1();
    });

    resultatNetN1 = computed(() => {
        this.formChangeCounter();
        return this.cashFlowN1() + this.autresRevenusN1();
    });

    // Rentabilité N+1 (Prévisionnel)
    margeBruteN2 = computed(() => {
        this.formChangeCounter(); // Dépendance pour forcer le recalcul
        const ca = this.rentabiliteN2Form?.get('chiffreAffaires')?.value || 0;
        const coutAchats = this.rentabiliteN2Form?.get('coutAchatMarchandises')?.value || 0;
        return ca - coutAchats;
    });

    // Total des 13 charges d'exploitation N+1 (sans amortissements)
    totalChargesN2 = computed(() => {
        this.formChangeCounter();
        const form = this.rentabiliteN2Form;
        if (!form) return 0;
        return (
            (form.get('salaires')?.value || 0) +
            (form.get('prelevementEntrepreneur')?.value || 0) +
            (form.get('loyers')?.value || 0) +
            (form.get('transport')?.value || 0) +
            (form.get('electriciteEauTelephone')?.value || 0) +
            (form.get('fournituresAutresBesoins')?.value || 0) +
            (form.get('entretienReparation')?.value || 0) +
            (form.get('carburantLubrifiants')?.value || 0) +
            (form.get('publicitePromotion')?.value || 0) +
            (form.get('impotsTaxes')?.value || 0) +
            (form.get('fraisBancairesInterets')?.value || 0) +
            (form.get('echeanceAutreCredit')?.value || 0) +
            (form.get('diversesCharges')?.value || 0)
        );
    });

    // Amortissements N+1
    amortissementsN2 = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteN2Form?.get('amortissementsProvisions')?.value || 0;
    });

    // Autres revenus N+1
    autresRevenusN2 = computed(() => {
        this.formChangeCounter();
        return this.rentabiliteN2Form?.get('autresRevenusHorsActivite')?.value || 0;
    });

    resultatExploitationN2 = computed(() => {
        this.formChangeCounter();
        const margeBrute = this.margeBruteN2();
        const totalCharges = this.totalChargesN2();
        const amortissements = this.amortissementsN2();
        return margeBrute - totalCharges - amortissements;
    });

    cashFlowN2 = computed(() => {
        this.formChangeCounter();
        return this.resultatExploitationN2() + this.amortissementsN2();
    });

    resultatNetN2 = computed(() => {
        this.formChangeCounter();
        return this.cashFlowN2() + this.autresRevenusN2();
    });

    // ============== COMPUTED VALUES FOR BESOIN CREDIT ==============

    // INVESTISSEMENT - Colonnes Montant
    investissementCoutEquipement = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('coutEquipement')?.value || 0; });
    investissementDepensesRattachees = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('depensesRattachees')?.value || 0; });
    investissementApportPersonnel = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('apportPersonnel')?.value || 0; });

    // INVESTISSEMENT - Colonnes Ajustement
    investissementAjustCoutEquipement = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustCoutEquipement')?.value || 0; });
    investissementAjustDepensesRattachees = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustDepensesRattachees')?.value || 0; });
    investissementAjustApportPersonnel = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustApportPersonnel')?.value || 0; });

    // INVESTISSEMENT - Colonnes Montant effectif (Montant + Ajustement)
    effCoutEquipement = computed(() => this.investissementCoutEquipement() + this.investissementAjustCoutEquipement());
    effDepensesRattachees = computed(() => this.investissementDepensesRattachees() + this.investissementAjustDepensesRattachees());
    effApportPersonnel = computed(() => this.investissementApportPersonnel() + this.investissementAjustApportPersonnel());

    // INVESTISSEMENT - Totaux
    totalInvestissementMontant = computed(() => this.investissementCoutEquipement() + this.investissementDepensesRattachees());
    totalInvestissementAjuste = computed(() => this.investissementAjustCoutEquipement() + this.investissementAjustDepensesRattachees());
    totalInvestissementEffectif = computed(() => this.effCoutEquipement() + this.effDepensesRattachees());

    // INVESTISSEMENT - Besoin réel = Total invest - Apport personnel
    besoinReelInvestissementMontant = computed(() => this.totalInvestissementMontant() - this.investissementApportPersonnel());
    besoinReelInvestissementAjuste = computed(() => this.totalInvestissementAjuste() - this.investissementAjustApportPersonnel());
    besoinReelInvestissementFinal = computed(() => this.totalInvestissementEffectif() - this.effApportPersonnel());

    // EXPLOITATION - Colonnes Montant
    exploitationCoutAchatCycle = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('coutAchatCycle')?.value || 0; });
    exploitationNbreCycles = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('nbreCycleFinancer')?.value || 1; });
    exploitationTresorerieDispo = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('tresorerieDisponible')?.value || 0; });
    exploitationStockActuel = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('stockActuel')?.value || 0; });
    exploitationComptesRecevoir = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('comptesRecevoir')?.value || 0; });
    exploitationDettesFournisseurs = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('dettesFournisseurs')?.value || 0; });
    exploitationCreditFournisseur = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('creditFournisseur')?.value || 0; });

    // EXPLOITATION - Colonnes Ajustement
    exploitationAjustCoutAchat = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustCoutAchatCycle')?.value || 0; });
    exploitationAjustTresorerie = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustTresorerieDispo')?.value || 0; });
    exploitationAjustStock = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustStockActuel')?.value || 0; });
    exploitationAjustComptes = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustComptesRecevoir')?.value || 0; });
    exploitationAjustDettes = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustDettesFournisseurs')?.value || 0; });
    exploitationAjustCredit = computed(() => { this.formChangeCounter(); return this.besoinCreditForm?.get('ajustCreditFournisseur')?.value || 0; });

    // EXPLOITATION - Montants effectifs
    effCoutAchatCycle = computed(() => this.exploitationCoutAchatCycle() + this.exploitationAjustCoutAchat());
    effTresorerieDispo = computed(() => this.exploitationTresorerieDispo() + this.exploitationAjustTresorerie());
    effStockActuel = computed(() => this.exploitationStockActuel() + this.exploitationAjustStock());
    effComptesRecevoir = computed(() => this.exploitationComptesRecevoir() + this.exploitationAjustComptes());
    effDettesFournisseurs = computed(() => this.exploitationDettesFournisseurs() + this.exploitationAjustDettes());
    effCreditFournisseur = computed(() => this.exploitationCreditFournisseur() + this.exploitationAjustCredit());

    // EXPLOITATION - Besoin brut = Coût achat × Nbre cycles
    besoinBrutExploitationMontant = computed(() => this.exploitationCoutAchatCycle() * this.exploitationNbreCycles());
    besoinBrutExploitationAjuste = computed(() => this.exploitationAjustCoutAchat() * this.exploitationNbreCycles());
    besoinBrutExploitationEffectif = computed(() => this.effCoutAchatCycle() * this.exploitationNbreCycles());

    // EXPLOITATION - Ressources disponibles = Trésorerie + Stock + Comptes à recevoir
    ressourcesDisponiblesMontant = computed(() => this.exploitationTresorerieDispo() + this.exploitationStockActuel() + this.exploitationComptesRecevoir());
    ressourcesDisponiblesAjuste = computed(() => this.exploitationAjustTresorerie() + this.exploitationAjustStock() + this.exploitationAjustComptes());
    ressourcesDisponiblesEffectif = computed(() => this.effTresorerieDispo() + this.effStockActuel() + this.effComptesRecevoir());

    // EXPLOITATION - Dettes = Dettes fournisseurs + Crédit fournisseur
    totalDettesMontant = computed(() => this.exploitationDettesFournisseurs() + this.exploitationCreditFournisseur());
    totalDettesAjuste = computed(() => this.exploitationAjustDettes() + this.exploitationAjustCredit());
    totalDettesEffectif = computed(() => this.effDettesFournisseurs() + this.effCreditFournisseur());

    // EXPLOITATION - Besoin réel = Besoin brut - Ressources + Dettes
    besoinReelExploitationMontant = computed(() => this.besoinBrutExploitationMontant() - this.ressourcesDisponiblesMontant() + this.totalDettesMontant());
    besoinReelExploitationAjuste = computed(() => this.besoinBrutExploitationAjuste() - this.ressourcesDisponiblesAjuste() + this.totalDettesAjuste());
    besoinReelExploitationFinal = computed(() => this.besoinBrutExploitationEffectif() - this.ressourcesDisponiblesEffectif() + this.totalDettesEffectif());

    // TOTAL FINANCEMENT = Besoin investissement + Besoin exploitation
    besoinTotalFinancementMontant = computed(() => this.besoinReelInvestissementMontant() + this.besoinReelExploitationMontant());
    besoinTotalFinancementAjuste = computed(() => this.besoinReelInvestissementAjuste() + this.besoinReelExploitationAjuste());
    besoinTotalFinancementFinal = computed(() => this.besoinReelInvestissementFinal() + this.besoinReelExploitationFinal());

    // ============== COMPUTED FOR PROPOSITION (Echeance) ==============

    echeanceMensuelle = computed(() => {
        const montant = this.propositionForm?.get('montantPropose')?.value || 0;
        const duree = this.propositionForm?.get('dureeProposee')?.value || 12;
        const taux = this.propositionForm?.get('tauxPropose')?.value || 0;
        const periodicite = this.propositionForm?.get('periodiciteProposee')?.value;

        if (montant <= 0 || duree <= 0) return 0;

        const facteurPeriodicite = this.getFacteurPeriodicite(periodicite);
        const nombreEcheances = Math.ceil(duree / facteurPeriodicite);
        const tauxPeriodique = ((taux / 100) * facteurPeriodicite) / 12;

        if (tauxPeriodique === 0) {
            return montant / nombreEcheances;
        }

        // Formule d'annuité constante
        const echeance = (montant * (tauxPeriodique * Math.pow(1 + tauxPeriodique, nombreEcheances))) / (Math.pow(1 + tauxPeriodique, nombreEcheances) - 1);

        return echeance;
    });

    capaciteRemboursementProposee = computed(() => {
        const cashFlow = this.cashFlowN2();
        const echeance = this.echeanceMensuelle();
        if (echeance === 0) return 0;
        // Cash-flow annuel / Echéance annualisée
        const periodicite = this.propositionForm?.get('periodiciteProposee')?.value;
        const facteur = this.getFacteurPeriodicite(periodicite);
        const echeanceAnnuelle = echeance * (12 / facteur);
        return cashFlow / echeanceAnnuelle;
    });

    ngOnInit() {
        this.initForms();
        this.initStepItems();

        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.demandeIndividuelId = params['demandeindividuelId'] ? parseInt(params['demandeindividuelId'], 10) : null;

            if (!this.demandeIndividuelId) {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: "ID de la demande individuelle manquant dans l'URL",
                    life: 3000
                });
                return;
            }

            this.loadAllData();
        });
    }

    private loadAllData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        forkJoin({
            initialData: this.userService.startNewDemandeInd$(),
            demandeData: this.userService.getDemandeWithGaranties$(this.demandeIndividuelId!)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (responses) => {
                    if (responses.initialData?.data) {
                        this.state.update((state) => ({
                            ...state,
                            allDelegations: responses.initialData.data.delegations || [],
                            allAgences: responses.initialData.data.agences || [],
                            allPointsVente: responses.initialData.data.pointVentes || []
                        }));
                    }

                    if (responses.demandeData?.data) {
                        const demandeIndividuel = responses.demandeData.data.demandeIndividuel;
                        const userId = responses.demandeData.data.user?.userId!;

                        this.state.update((state) => ({
                            ...state,
                            demandeIndividuel,
                            userId,
                            loading: false
                        }));

                        this.prefillFormsWithDemande(demandeIndividuel);
                        this.loadExistingAnalyse();
                    }
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    private loadExistingAnalyse(): void {
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/analyse/demande/${this.demandeIndividuelId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const analyse = response?.data?.analyse;
                    // Backend returns analyseId, not id
                    const analyseIdValue = analyse?.analyseId || analyse?.id;
                    if (analyse && analyseIdValue) {
                        this.state.update((state) => ({
                            ...state,
                            analyseId: analyseIdValue,
                            analyseExiste: true
                        }));
                        this.loadAnalyseDetails(analyseIdValue);
                    } else {
                        this.state.update((state) => ({ ...state, analyseExiste: false }));
                    }
                },
                error: () => {
                    // Analyse n'existe pas encore, c'est normal
                    this.state.update((state) => ({ ...state, analyseExiste: false }));
                }
            });
    }

    private loadAnalyseDetails(analyseId: number): void {
        // Vérifier que analyseId est défini avant de faire les appels API
        if (!analyseId || analyseId === undefined || analyseId === null) {
            console.warn('loadAnalyseDetails called with invalid analyseId:', analyseId);
            return;
        }

        // Charger bilans
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/bilan/analyse/${analyseId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.bilans) {
                        response.data.bilans.forEach((bilan: any) => {
                            if (bilan.typePeriode === 'N') {
                                this.patchBilanForm(this.bilanNForm, bilan);
                            } else if (bilan.typePeriode === 'N-1') {
                                this.patchBilanForm(this.bilanN1Form, bilan);
                            }
                        });
                        if (response.data.bilans.length > 0) {
                            this.bilanSaved.set(true);
                        }
                    }
                }
            });

        // Charger rentabilités
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/rentabilite/analyse/${analyseId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.rentabilites) {
                        response.data.rentabilites.forEach((rent: any) => {
                            if (rent.typePeriode === 'N') {
                                this.patchRentabiliteForm(this.rentabiliteNForm, rent);
                            } else if (rent.typePeriode === 'N-1') {
                                this.patchRentabiliteForm(this.rentabiliteN1Form, rent);
                            } else if (rent.typePeriode === 'N+1') {
                                this.patchRentabiliteForm(this.rentabiliteN2Form, rent);
                            }
                        });
                        if (response.data.rentabilites.length > 0) {
                            this.rentabiliteSaved.set(true);
                        }
                    }
                }
            });

        // Charger besoin crédit
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/besoin-credit/analyse/${analyseId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.besoinCredit) {
                        this.patchBesoinCreditForm(response.data.besoinCredit);
                        this.besoinCreditSaved.set(true);
                    }
                }
            });

        // Charger proposition
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/proposition/${this.demandeIndividuelId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.proposition) {
                        this.patchPropositionForm(response.data.proposition);
                    }
                }
            });

        // Charger ratios
        this.loadRatios(analyseId);
    }

    private loadRatios(analyseId: number): void {
        if (!analyseId) {
            console.warn('loadRatios called with invalid analyseId:', analyseId);
            return;
        }
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/ratios/analyse/${analyseId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.ratios) {
                        this.updateRatiosData(response.data.ratios);
                    }
                }
            });
    }

    private updateRatiosData(ratios: any): void {
        const ratiosList: RatioInfo[] = [
            {
                code: 'R1',
                nom: 'Capacité de remboursement',
                operateur: '>=',
                norme: 2.0,
                normeDisplay: '200%',
                sollicite: ratios.r1Sollicite,
                propose: ratios.r1Propose,
                conformeSollicite: ratios.r1ConformeSollicite || false,
                conformePropose: ratios.r1ConformePropose || false
            },
            {
                code: 'R2',
                nom: 'Solvabilité',
                operateur: '>=',
                norme: 0.35,
                normeDisplay: '35%',
                sollicite: ratios.r2Sollicite,
                propose: ratios.r2Propose,
                conformeSollicite: ratios.r2ConformeSollicite || false,
                conformePropose: ratios.r2ConformePropose || false
            },
            {
                code: 'R3',
                nom: 'Liquidité à échéance',
                operateur: '>=',
                norme: 1.0,
                normeDisplay: '100%',
                sollicite: ratios.r3Sollicite,
                propose: ratios.r3Propose,
                conformeSollicite: ratios.r3ConformeSollicite || false,
                conformePropose: ratios.r3ConformePropose || false
            },
            {
                code: 'R4',
                nom: 'Endettement',
                operateur: '<',
                norme: 0.5,
                normeDisplay: '< 50%',
                sollicite: ratios.r4Sollicite,
                propose: ratios.r4Propose,
                conformeSollicite: ratios.r4ConformeSollicite || false,
                conformePropose: ratios.r4ConformePropose || false
            },
            {
                code: 'R5',
                nom: 'Dépendance',
                operateur: '<',
                norme: 0.5,
                normeDisplay: '< 50%',
                sollicite: ratios.r5Sollicite,
                propose: ratios.r5Propose,
                conformeSollicite: ratios.r5ConformeSollicite || false,
                conformePropose: ratios.r5ConformePropose || false
            },
            {
                code: 'R6',
                nom: 'Couverture garantie',
                operateur: '>',
                norme: 1.5,
                normeDisplay: '> 150%',
                sollicite: ratios.r6Sollicite,
                propose: ratios.r6Propose,
                conformeSollicite: ratios.r6ConformeSollicite || false,
                conformePropose: ratios.r6ConformePropose || false
            }
        ];

        this.ratiosData.set(ratiosList);
    }

    private prefillFormsWithDemande(demande: any): void {
        if (!demande) return;

        // Prefill demande credit form
        this.demandeCreditForm.patchValue({
            montantDemande: demande.montantDemande,
            dureeMois: demande.dureeDemande,
            objetFinancement: demande.detailObjectCredit
        });

        // Prefill proposition with demande values
        this.propositionForm.patchValue({
            montantSollicite: demande.montantDemande,
            dureeSollicitee: demande.dureeDemande,
            montantPropose: demande.montantDemande,
            dureeProposee: demande.dureeDemande
        });

        // Set delegation, agence, point vente
        if (demande.delegation) {
            const delegation = this.state().allDelegations.find((d) => d.id === demande.delegation);
            if (delegation) {
                this.demandeCreditForm.patchValue({ delegation });
                this.onDelegationChange({ value: delegation });

                setTimeout(() => {
                    if (demande.agence) {
                        const agence = this.state().filteredAgences.find((a) => a.id === demande.agence);
                        if (agence) {
                            this.demandeCreditForm.patchValue({ agence });
                            this.onAgenceChange({ value: agence });

                            setTimeout(() => {
                                if (demande.pos) {
                                    const pointVente = this.state().filteredPointsVente.find((p) => p.id === demande.pos);
                                    if (pointVente) {
                                        this.demandeCreditForm.patchValue({ pointVente });
                                    }
                                }
                            }, 100);
                        }
                    }
                }, 100);
            }
        }

        // Disable location fields
        this.demandeCreditForm.get('objetFinancement')?.disable();
        this.demandeCreditForm.get('delegation')?.disable();
        this.demandeCreditForm.get('agence')?.disable();
        this.demandeCreditForm.get('pointVente')?.disable();
    }

    private patchBilanForm(form: FormGroup, bilan: any): void {
        form.patchValue({
            terrains: bilan.terrains || bilan.terrain || 0,
            constructions: bilan.constructions || bilan.batimentMagasin || 0,
            installationsTechniques: bilan.installationsTechniques || bilan.installationAgencement || 0,
            materielTransport: bilan.materielTransport || 0,
            materielBureau: bilan.materielBureau || bilan.mobilierBureau || 0,
            autresImmobilisations: bilan.autresImmobilisations || bilan.autreImmobilisation || 0,
            immobilisationsEnCours: bilan.immobilisationsEnCours || 0,
            immobilisationsFinancieres: bilan.immobilisationsFinancieres || 0,
            stocks: bilan.stocks || 0,
            creances: bilan.creances || bilan.creancesClients || 0,
            tresorerieActif: bilan.tresorerieActif || bilan.tresorerieCaisseBanque || 0,
            capitauxPropre: bilan.capitauxPropre || 0,
            dettesLongTerme: bilan.dettesLongTerme || bilan.empruntLongTerme || 0,
            dettesCourtTerme: bilan.dettesCourtTerme || bilan.empruntCourtTerme || 0,
            tresoreriePassif: bilan.tresoreriePassif || bilan.autresDettes || 0
        });
    }

    private patchRentabiliteForm(form: FormGroup, rent: any): void {
        form.patchValue({
            chiffreAffaires: rent.chiffreAffaires || 0,
            coutAchatMarchandises: rent.coutAchatMarchandises || 0,
            // 13 charges d'exploitation
            salaires: rent.salaires || 0,
            prelevementEntrepreneur: rent.prelevementEntrepreneur || 0,
            loyers: rent.loyers || 0,
            transport: rent.transport || 0,
            electriciteEauTelephone: rent.electriciteEauTelephone || 0,
            fournituresAutresBesoins: rent.fournituresAutresBesoins || 0,
            entretienReparation: rent.entretienReparation || 0,
            carburantLubrifiants: rent.carburantLubrifiants || 0,
            publicitePromotion: rent.publicitePromotion || 0,
            impotsTaxes: rent.impotsTaxes || 0,
            fraisBancairesInterets: rent.fraisBancairesInterets || 0,
            echeanceAutreCredit: rent.echeanceAutreCredit || 0,
            diversesCharges: rent.diversesCharges || 0,
            // Amortissements et autres revenus
            amortissementsProvisions: rent.amortissementsProvisions || 0,
            autresRevenusHorsActivite: rent.autresRevenusHorsActivite || 0
        });
    }

    private patchBesoinCreditForm(besoin: any): void {
        this.besoinCreditForm.patchValue({
            // INVESTISSEMENT - Montants
            coutEquipement: besoin.coutEquipement || 0,
            depensesRattachees: besoin.depensesRattachees || 0,
            apportPersonnel: besoin.apportPersonnel || 0,
            // INVESTISSEMENT - Ajustements
            ajustCoutEquipement: besoin.ajustCoutEquipement || 0,
            ajustDepensesRattachees: besoin.ajustDepensesRattachees || 0,
            ajustApportPersonnel: besoin.ajustApportPersonnel || 0,
            // EXPLOITATION - Montants
            coutAchatCycle: besoin.coutAchatCycle || 0,
            nbreCycleFinancer: besoin.nbreCycleFinancer || 1,
            tresorerieDisponible: besoin.tresorerieDisponible || 0,
            stockActuel: besoin.stockActuel || 0,
            comptesRecevoir: besoin.comptesRecevoir || 0,
            dettesFournisseurs: besoin.dettesFournisseurs || 0,
            creditFournisseur: besoin.creditFournisseur || 0,
            // EXPLOITATION - Ajustements
            ajustCoutAchatCycle: besoin.ajustCoutAchatCycle || 0,
            ajustTresorerieDispo: besoin.ajustTresorerieDispo || 0,
            ajustStockActuel: besoin.ajustStockActuel || 0,
            ajustComptesRecevoir: besoin.ajustComptesRecevoir || 0,
            ajustDettesFournisseurs: besoin.ajustDettesFournisseurs || 0,
            ajustCreditFournisseur: besoin.ajustCreditFournisseur || 0
        });
    }

    private patchPropositionForm(prop: any): void {
        this.propositionForm.patchValue({
            montantSollicite: prop.montantSollicite || 0,
            dureeSollicitee: prop.dureeSollicitee || 0,
            montantPropose: prop.montantPropose || 0,
            dureeProposee: prop.dureeProposee || 0,
            tauxPropose: prop.tauxPropose || 0,
            periodiciteProposee: prop.periodiciteProposee || 'MENSUELLE',
            commentaireOrientation: prop.commentaireOrientation || ''
        });
    }

    initStepItems() {
        this.items.set([
            { label: 'Bilan', command: () => this.onStepChange(0) },
            { label: 'Rentabilité', command: () => this.onStepChange(1) },
            { label: 'Personnes caution', command: () => this.onStepChange(2) },
            { label: 'Besoin Crédit', command: () => this.onStepChange(3) },
            { label: 'Synthèse', command: () => this.onStepChange(4) }
        ]);
    }

    initForms() {
        // Bilan N
        this.bilanNForm = this.fb.group({
            // Actif immobilisé
            terrains: [0],
            constructions: [0],
            installationsTechniques: [0],
            materielTransport: [0],
            materielBureau: [0],
            autresImmobilisations: [0],
            immobilisationsEnCours: [0],
            immobilisationsFinancieres: [0],
            // Actif circulant
            stocks: [0],
            creances: [0],
            tresorerieActif: [0],
            // Passif - Capitaux propres
            capitauxPropre: [0],
            // Passif - Dettes
            dettesLongTerme: [0],
            dettesCourtTerme: [0],
            tresoreriePassif: [0]
        });

        // Bilan N-1
        this.bilanN1Form = this.fb.group({
            terrains: [0],
            constructions: [0],
            installationsTechniques: [0],
            materielTransport: [0],
            materielBureau: [0],
            autresImmobilisations: [0],
            immobilisationsEnCours: [0],
            immobilisationsFinancieres: [0],
            stocks: [0],
            creances: [0],
            tresorerieActif: [0],
            // Passif - Capitaux propres
            capitauxPropre: [0],
            // Passif - Dettes
            dettesLongTerme: [0],
            dettesCourtTerme: [0],
            tresoreriePassif: [0]
        });

        // Rentabilité N - 13 charges selon la table analyse_rentabilite
        this.rentabiliteNForm = this.fb.group({
            chiffreAffaires: [0],
            coutAchatMarchandises: [0],
            // 13 charges d'exploitation
            salaires: [0],
            prelevementEntrepreneur: [0],
            loyers: [0],
            transport: [0],
            electriciteEauTelephone: [0],
            fournituresAutresBesoins: [0],
            entretienReparation: [0],
            carburantLubrifiants: [0],
            publicitePromotion: [0],
            impotsTaxes: [0],
            fraisBancairesInterets: [0],
            echeanceAutreCredit: [0],
            diversesCharges: [0],
            // Amortissements et autres revenus
            amortissementsProvisions: [0],
            autresRevenusHorsActivite: [0]
        });

        // Rentabilité N-1 - 13 charges selon la table analyse_rentabilite
        this.rentabiliteN1Form = this.fb.group({
            chiffreAffaires: [0],
            coutAchatMarchandises: [0],
            // 13 charges d'exploitation
            salaires: [0],
            prelevementEntrepreneur: [0],
            loyers: [0],
            transport: [0],
            electriciteEauTelephone: [0],
            fournituresAutresBesoins: [0],
            entretienReparation: [0],
            carburantLubrifiants: [0],
            publicitePromotion: [0],
            impotsTaxes: [0],
            fraisBancairesInterets: [0],
            echeanceAutreCredit: [0],
            diversesCharges: [0],
            // Amortissements et autres revenus
            amortissementsProvisions: [0],
            autresRevenusHorsActivite: [0]
        });

        // Rentabilité N+1 (Prévisionnel) - 13 charges selon la table analyse_rentabilite
        this.rentabiliteN2Form = this.fb.group({
            chiffreAffaires: [0],
            coutAchatMarchandises: [0],
            // 13 charges d'exploitation
            salaires: [0],
            prelevementEntrepreneur: [0],
            loyers: [0],
            transport: [0],
            electriciteEauTelephone: [0],
            fournituresAutresBesoins: [0],
            entretienReparation: [0],
            carburantLubrifiants: [0],
            publicitePromotion: [0],
            impotsTaxes: [0],
            fraisBancairesInterets: [0],
            echeanceAutreCredit: [0],
            diversesCharges: [0],
            // Amortissements et autres revenus
            amortissementsProvisions: [0],
            autresRevenusHorsActivite: [0]
        });

        // Besoin crédit - Conforme à la table analyse_besoin_credit et Excel
        this.besoinCreditForm = this.fb.group({
            // INVESTISSEMENT - Montants
            coutEquipement: [0],
            depensesRattachees: [0],
            apportPersonnel: [0],
            // INVESTISSEMENT - Ajustements
            ajustCoutEquipement: [0],
            ajustDepensesRattachees: [0],
            ajustApportPersonnel: [0],
            // EXPLOITATION - Montants
            coutAchatCycle: [0],
            nbreCycleFinancer: [1],
            tresorerieDisponible: [0],
            stockActuel: [0],
            comptesRecevoir: [0],
            dettesFournisseurs: [0],
            creditFournisseur: [0],
            // EXPLOITATION - Ajustements
            ajustCoutAchatCycle: [0],
            ajustTresorerieDispo: [0],
            ajustStockActuel: [0],
            ajustComptesRecevoir: [0],
            ajustDettesFournisseurs: [0],
            ajustCreditFournisseur: [0]
        });

        // Proposition
        this.propositionForm = this.fb.group({
            montantSollicite: [0],
            dureeSollicitee: [12],
            montantPropose: [0],
            dureeProposee: [12],
            tauxPropose: [0],
            periodiciteProposee: ['MENSUELLE'],
            commentaireOrientation: ['']
        });

        // Demande credit
        this.demandeCreditForm = this.fb.group({
            montantDemande: [0],
            dureeMois: [12],
            objetFinancement: [''],
            delegation: [null],
            agence: [null],
            pointVente: [null]
        });

        // Personne caution
        this.personnecautionForm = this.fb.group({
            nom: [''],
            prenom: [''],
            telephone: [''],
            activite: [''],
            age: [null],
            profession: ['']
        });

        // Subscribe to form valueChanges to trigger computed values recalculation
        this.bilanNForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.bilanN1Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.rentabiliteNForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.rentabiliteN1Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.rentabiliteN2Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.besoinCreditForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });

        this.propositionForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update(v => v + 1);
        });
    }

    onStepChange(index: number) {
        this.activeIndex.set(index);
    }

    nextStep() {
        const currentIndex = this.activeIndex();
        if (currentIndex < this.items().length - 1) {
            this.activeIndex.set(currentIndex + 1);
        }
    }

    prevStep() {
        const currentIndex = this.activeIndex();
        if (currentIndex > 0) {
            this.activeIndex.set(currentIndex - 1);
        }
    }

    onDelegationChange(event: any): void {
        const delegation = event.value;
        if (!delegation || !delegation.id) {
            this.state.update((state) => ({
                ...state,
                filteredAgences: [],
                filteredPointsVente: []
            }));
            return;
        }

        const delegationId = delegation.id;
        const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegationId) || [];

        this.state.update((state) => ({
            ...state,
            filteredAgences,
            filteredPointsVente: []
        }));

        if (!this.demandeCreditForm.get('delegation')?.disabled) {
            this.demandeCreditForm.patchValue({
                agence: null,
                pointVente: null
            });
        }
    }

    onAgenceChange(event: any): void {
        const agence = event.value;
        if (!agence || !agence.id) {
            this.state.update((state) => ({
                ...state,
                filteredPointsVente: []
            }));
            return;
        }

        const agenceId = agence.id;
        const filteredPointsVente = this.state().allPointsVente?.filter((pv) => pv.agence_id === agenceId) || [];

        this.state.update((state) => ({
            ...state,
            filteredPointsVente
        }));

        if (!this.demandeCreditForm.get('agence')?.disabled) {
            this.demandeCreditForm.patchValue({ pointVente: null });
        }
    }

    addPersonnecaution(): void {
        const personnecaution: Personnecaution = {
            nom: this.personnecautionForm.get('nom')?.value || '',
            prenom: this.personnecautionForm.get('prenom')?.value || '',
            telephone: this.personnecautionForm.get('telephone')?.value || '',
            activite: this.personnecautionForm.get('activite')?.value || '',
            age: this.personnecautionForm.get('age')?.value || undefined,
            profession: this.personnecautionForm.get('profession')?.value || ''
        };

        this.personnecautions.push(personnecaution);
        this.personnecautionForm.reset();

        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Personne caution ajoutée avec succès.'
        });
    }

    removePersonnecaution(index: number): void {
        this.personnecautions.splice(index, 1);
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Personne caution supprimée.'
        });
    }

    // ============== API CALLS ==============

    createOrUpdateAnalyse(): void {
        if (this.state().analyseExiste) {
            return; // Déjà créée
        }

        const request = {
            demandeindividuelId: this.demandeIndividuelId,
            nombreCycles: 12,
            hypothese: 'CROISSANCE_MODEREE'
        };

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/analyse`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const analyse = response?.data?.analyse;
                    if (analyse) {
                        // Backend returns analyseId, not id
                        const newAnalyseId = analyse.analyseId || analyse.id;
                        this.state.update((state) => ({
                            ...state,
                            analyseId: newAnalyseId,
                            analyseExiste: true
                        }));
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Analyse créée avec succès'
                        });
                    }
                },
                error: (error) => {
                    console.error('Error creating analyse:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible de créer l'analyse"
                    });
                }
            });
    }

    saveBilan(typePeriode: 'N' | 'N-1'): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer l'analyse"
            });
            return;
        }

        this.savingBilan.set(true);
        const form = typePeriode === 'N' ? this.bilanNForm : this.bilanN1Form;

        // Map frontend form fields to backend DTO fields
        const request = {
            analyseId: analyseId,
            typePeriode: typePeriode,
            // ACTIF - Immobilisations
            terrain: form.get('terrains')?.value || 0,
            batimentMagasin: form.get('constructions')?.value || 0,
            installationAgencement: form.get('installationsTechniques')?.value || 0,
            materielIndustriel: 0,
            mobilierBureau: form.get('materielBureau')?.value || 0,
            materielInformatique: 0,
            materielTransport: form.get('materielTransport')?.value || 0,
            autreImmobilisation: (form.get('autresImmobilisations')?.value || 0) + (form.get('immobilisationsEnCours')?.value || 0) + (form.get('immobilisationsFinancieres')?.value || 0),
            // ACTIF - Circulant
            stocks: form.get('stocks')?.value || 0,
            creancesClients: form.get('creances')?.value || 0,
            tresorerieCaisseBanque: form.get('tresorerieActif')?.value || 0,
            // PASSIF - Capitaux propres
            capitauxPropre: form.get('capitauxPropre')?.value || 0,
            // PASSIF - Dettes
            empruntLongTerme: form.get('dettesLongTerme')?.value || 0,
            empruntCourtTerme: form.get('dettesCourtTerme')?.value || 0,
            autresDettes: form.get('tresoreriePassif')?.value || 0
        };

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/bilan`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.savingBilan.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Bilan ${typePeriode} enregistré avec succès`
                    });
                },
                error: (error) => {
                    this.savingBilan.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer le bilan"
                    });
                }
            });
    }

    saveBilanAll(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer l'analyse"
            });
            return;
        }

        this.savingBilan.set(true);

        const requestN = this.mapBilanFormToRequest(this.bilanNForm, analyseId, 'N');
        const requestN1 = this.mapBilanFormToRequest(this.bilanN1Form, analyseId, 'N-1');

        forkJoin({
            bilanN: this.http.post<any>(`${this.apiUrl}/ecredit/bilan_finance/bilan`, requestN),
            bilanN1: this.http.post<any>(`${this.apiUrl}/ecredit/bilan_finance/bilan`, requestN1)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.savingBilan.set(false);
                    this.bilanSaved.set(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Bilans N et N-1 enregistrés avec succès'
                    });
                },
                error: (error) => {
                    this.savingBilan.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer les bilans"
                    });
                }
            });
    }

    // Convertit le format frontend (N-1, N+1) vers le format backend (N_MOINS_1, N_PLUS_1)
    private convertPeriodeToBackend(periode: string): string {
        const mapping: { [key: string]: string } = {
            N: 'N',
            'N-1': 'N_MOINS_1',
            'N+1': 'N_PLUS_1'
        };
        return mapping[periode] || periode;
    }

    private mapBilanFormToRequest(form: FormGroup, analyseId: number, typePeriode: string): any {
        return {
            analyseId: analyseId,
            typePeriode: this.convertPeriodeToBackend(typePeriode),
            // ACTIF - Immobilisations
            terrain: form.get('terrains')?.value || 0,
            batimentMagasin: form.get('constructions')?.value || 0,
            installationAgencement: form.get('installationsTechniques')?.value || 0,
            materielIndustriel: 0,
            mobilierBureau: form.get('materielBureau')?.value || 0,
            materielInformatique: 0,
            materielTransport: form.get('materielTransport')?.value || 0,
            autreImmobilisation: (form.get('autresImmobilisations')?.value || 0) + (form.get('immobilisationsEnCours')?.value || 0) + (form.get('immobilisationsFinancieres')?.value || 0),
            // ACTIF - Circulant
            stocks: form.get('stocks')?.value || 0,
            creancesClients: form.get('creances')?.value || 0,
            tresorerieCaisseBanque: form.get('tresorerieActif')?.value || 0,
            // PASSIF - Capitaux propres
            capitauxPropre: form.get('capitauxPropre')?.value || 0,
            // PASSIF - Dettes
            empruntLongTerme: form.get('dettesLongTerme')?.value || 0,
            empruntCourtTerme: form.get('dettesCourtTerme')?.value || 0,
            autresDettes: form.get('tresoreriePassif')?.value || 0
        };
    }

    saveRentabilite(typePeriode: 'N' | 'N-1' | 'N+1'): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer l'analyse"
            });
            return;
        }

        this.savingRentabilite.set(true);
        let form: FormGroup;
        if (typePeriode === 'N') form = this.rentabiliteNForm;
        else if (typePeriode === 'N-1') form = this.rentabiliteN1Form;
        else form = this.rentabiliteN2Form;

        const request = this.mapRentabiliteFormToRequest(form, analyseId, typePeriode);

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.savingRentabilite.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Rentabilité ${typePeriode} enregistrée avec succès`
                    });
                },
                error: (error) => {
                    this.savingRentabilite.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer la rentabilité"
                    });
                }
            });
    }

    private mapRentabiliteFormToRequest(form: FormGroup, analyseId: number, typePeriode: string): any {
        const ca = form.get('chiffreAffaires')?.value || 0;
        const coutAchats = form.get('coutAchatMarchandises')?.value || 0;
        return {
            analyseId: analyseId,
            typePeriode: this.convertPeriodeToBackend(typePeriode),
            // Revenue
            chiffreAffaires: ca,
            coutAchatMarchandises: coutAchats,
            margeBrute: ca - coutAchats,
            // 13 Charges d'exploitation
            salaires: form.get('salaires')?.value || 0,
            prelevementEntrepreneur: form.get('prelevementEntrepreneur')?.value || 0,
            loyers: form.get('loyers')?.value || 0,
            transport: form.get('transport')?.value || 0,
            electriciteEauTelephone: form.get('electriciteEauTelephone')?.value || 0,
            fournituresAutresBesoins: form.get('fournituresAutresBesoins')?.value || 0,
            entretienReparation: form.get('entretienReparation')?.value || 0,
            carburantLubrifiants: form.get('carburantLubrifiants')?.value || 0,
            publicitePromotion: form.get('publicitePromotion')?.value || 0,
            impotsTaxes: form.get('impotsTaxes')?.value || 0,
            fraisBancairesInterets: form.get('fraisBancairesInterets')?.value || 0,
            echeanceAutreCredit: form.get('echeanceAutreCredit')?.value || 0,
            diversesCharges: form.get('diversesCharges')?.value || 0,
            // Amortissements et autres revenus
            amortissementsProvisions: form.get('amortissementsProvisions')?.value || 0,
            autresRevenusHorsActivite: form.get('autresRevenusHorsActivite')?.value || 0
        };
    }

    saveRentabiliteAll(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer l'analyse"
            });
            return;
        }

        this.savingRentabilite.set(true);

        const requestN = this.mapRentabiliteFormToRequest(this.rentabiliteNForm, analyseId, 'N');
        const requestN1 = this.mapRentabiliteFormToRequest(this.rentabiliteN1Form, analyseId, 'N-1');
        const requestN2 = this.mapRentabiliteFormToRequest(this.rentabiliteN2Form, analyseId, 'N+1');

        forkJoin({
            rentabiliteN: this.http.post<any>(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN),
            rentabiliteN1: this.http.post<any>(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN1),
            rentabiliteN2: this.http.post<any>(`${this.apiUrl}/ecredit/bilan_finance/rentabilite`, requestN2)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.savingRentabilite.set(false);
                    this.rentabiliteSaved.set(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Rentabilités N, N-1 et N+1 enregistrées avec succès'
                    });
                },
                error: (error) => {
                    this.savingRentabilite.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer les rentabilités"
                    });
                }
            });
    }

    saveBesoinCredit(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer l'analyse"
            });
            return;
        }

        this.savingBesoinCredit.set(true);

        const form = this.besoinCreditForm;
        const request = {
            analyseId: analyseId,
            // INVESTISSEMENT - Montants
            coutEquipement: form.get('coutEquipement')?.value || 0,
            depensesRattachees: form.get('depensesRattachees')?.value || 0,
            apportPersonnel: form.get('apportPersonnel')?.value || 0,
            // INVESTISSEMENT - Ajustements
            ajustCoutEquipement: form.get('ajustCoutEquipement')?.value || 0,
            ajustDepensesRattachees: form.get('ajustDepensesRattachees')?.value || 0,
            ajustApportPersonnel: form.get('ajustApportPersonnel')?.value || 0,
            // EXPLOITATION - Montants
            coutAchatCycle: form.get('coutAchatCycle')?.value || 0,
            nbreCycleFinancer: form.get('nbreCycleFinancer')?.value || 1,
            tresorerieDisponible: form.get('tresorerieDisponible')?.value || 0,
            stockActuel: form.get('stockActuel')?.value || 0,
            comptesRecevoir: form.get('comptesRecevoir')?.value || 0,
            dettesFournisseurs: form.get('dettesFournisseurs')?.value || 0,
            creditFournisseur: form.get('creditFournisseur')?.value || 0,
            // EXPLOITATION - Ajustements
            ajustCoutAchatCycle: form.get('ajustCoutAchatCycle')?.value || 0,
            ajustTresorerieDispo: form.get('ajustTresorerieDispo')?.value || 0,
            ajustStockActuel: form.get('ajustStockActuel')?.value || 0,
            ajustComptesRecevoir: form.get('ajustComptesRecevoir')?.value || 0,
            ajustDettesFournisseurs: form.get('ajustDettesFournisseurs')?.value || 0,
            ajustCreditFournisseur: form.get('ajustCreditFournisseur')?.value || 0
        };

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/besoin-credit`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.savingBesoinCredit.set(false);
                    this.besoinCreditSaved.set(true);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Besoin en crédit enregistré avec succès'
                    });
                },
                error: (error) => {
                    this.savingBesoinCredit.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer le besoin en crédit"
                    });
                }
            });
    }

    saveProposition(): void {
        this.loading.set(true);

        const request = {
            montantSollicite: this.propositionForm.get('montantSollicite')?.value,
            dureeSollicitee: this.propositionForm.get('dureeSollicitee')?.value,
            montantPropose: this.propositionForm.get('montantPropose')?.value,
            dureeProposee: this.propositionForm.get('dureeProposee')?.value,
            tauxPropose: this.propositionForm.get('tauxPropose')?.value,
            periodiciteProposee: this.propositionForm.get('periodiciteProposee')?.value
        };

        this.http
            .put<any>(`${this.apiUrl}/ecredit/bilan_finance/proposition/${this.demandeIndividuelId}`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Proposition enregistrée avec succès'
                    });
                },
                error: (error) => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || "Impossible d'enregistrer la proposition"
                    });
                }
            });
    }

    calculateRatios(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord créer et sauvegarder l'analyse"
            });
            return;
        }

        this.calculatingRatios.set(true);

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/ratios/calculer/${analyseId}`, {})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.calculatingRatios.set(false);
                    if (response?.data?.ratios) {
                        this.updateRatiosData(response.data.ratios);
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Ratios calculés avec succès'
                        });
                    }
                },
                error: (error) => {
                    this.calculatingRatios.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error?.error?.message || 'Impossible de calculer les ratios'
                    });
                }
            });
    }

    submitAnalyse(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "L'analyse n'existe pas encore. Veuillez d'abord enregistrer le bilan et la rentabilité."
            });
            return;
        }

        this.loading.set(true);

        // Préparer les personnes caution pour l'envoi
        const personnesCautionData = this.personnecautions.map(pc => ({
            nom: pc.nom || '',
            prenom: pc.prenom || '',
            telephone: pc.telephone || '',
            activite: pc.activite || '',
            age: pc.age || null,
            profession: pc.profession || ''
        }));

        const request = {
            analyseId: analyseId,
            forcerSoumission: false,
            personnesCaution: personnesCautionData
        };

        // Appel API pour soumettre l'analyse via la procédure stockée fn_soumettre_analyse
        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/analyse/soumettre`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.loading.set(false);
                    const soumission = response?.data?.soumission;

                    if (soumission?.succes) {
                        const nbCautions = this.personnecautions.length;
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `Analyse soumise avec succès${nbCautions > 0 ? ' avec ' + nbCautions + ' personne(s) caution' : ''}`
                        });

                        setTimeout(() => {
                            this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
                        }, 2000);
                    } else {
                        // Afficher les erreurs de validation
                        const erreurs = soumission?.erreurs || [];
                        const message = erreurs.length > 0 ? erreurs.join('\n') : 'La soumission a échoué. Vérifiez les données saisies.';

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Validation échouée',
                            detail: message,
                            life: 10000
                        });
                    }
                },
                error: (error) => {
                    this.loading.set(false);
                    const soumission = error?.error?.data?.soumission;
                    const erreurs = soumission?.erreurs || [];

                    if (erreurs.length > 0) {
                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Validation échouée',
                            detail: erreurs.join('\n'),
                            life: 10000
                        });
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: error?.error?.message || "Impossible de soumettre l'analyse"
                        });
                    }
                }
            });
    }

    // ============== HELPERS ==============

    // Helper to get FormControl from form - used in template
    getControl(form: FormGroup, name: string): FormControl {
        return form.get(name) as FormControl;
    }

    getFacteurPeriodicite(periodicite: string): number {
        const found = this.periodicites.find((p) => p.value === periodicite);
        return found?.facteur || 1;
    }

    formatRatioValue(value: number | null): string {
        if (value === null || value === undefined) return '-';
        return (value * 100).toFixed(1) + '%';
    }

    getRatioSeverity(conforme: boolean): 'success' | 'danger' {
        return conforme ? 'success' : 'danger';
    }

    getRatioLabel(conforme: boolean): string {
        return conforme ? 'Conforme' : 'Non conforme';
    }

    allRatiosConformesSollicite(): boolean {
        return this.ratiosData().every((r) => r.conformeSollicite);
    }

    allRatiosConformesPropose(): boolean {
        return this.ratiosData().every((r) => r.conformePropose);
    }
}
