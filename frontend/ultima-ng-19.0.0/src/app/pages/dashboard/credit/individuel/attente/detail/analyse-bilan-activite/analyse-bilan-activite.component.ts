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
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Personnecaution } from '@/interface/personnecaution';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AccordionModule } from 'primeng/accordion';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CollecteService } from './collecte.service';
import { CollecteDonnees, Amortissement, TYPES_IMMOBILISATION } from './collecte.models';
import { CreditActiviteData } from '@/service/credit-activite.model';

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
        SelectModule,
        AccordionModule,
        DialogModule,
        ConfirmDialogModule
    ],
    templateUrl: './analyse-bilan-activite.component.html',
    styleUrl: './analyse-bilan-activite.component.scss',
    providers: [MessageService, ConfirmationService, { provide: LOCALE_ID, useValue: 'fr-FR' }]
})
export class AnalyseBilanActiviteComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private http = inject(HttpClient);
    private route = inject(ActivatedRoute);
    private collecteService = inject(CollecteService);

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

    // ============== COLLECTE SIGNALS ==============
    collecte = signal<CollecteDonnees | null>(null);
    collecteLoading = signal<boolean>(false);
    savingCollecte = signal<boolean>(false);
    collecteSaved = signal<boolean>(false);

    // Collecte forms
    collecteHeaderForm!: FormGroup;
    section2Form!: FormGroup;
    section3Form!: FormGroup;
    section4Form!: FormGroup;
    section5Form!: FormGroup;
    section6Form!: FormGroup;
    section7Form!: FormGroup;
    section8Form!: FormGroup;
    section9Form!: FormGroup;

    // Amortissements
    amortissements = signal<Amortissement[]>([]);
    amortissementDialog = signal<boolean>(false);
    editingAmortissement = signal<Amortissement | null>(null);
    amortissementForm!: FormGroup;
    savingAmortissement = signal<boolean>(false);
    typesImmobilisation = TYPES_IMMOBILISATION;

    // Produits and Stock Articles for sections 4 and 5
    produits = signal<any[]>([]);
    stockArticles = signal<any[]>([]);

    // OUI/NON options for dropdowns
    ouiNonOptions = [
        { label: 'OUI', value: true },
        { label: 'NON', value: false }
    ];

    // Secteur activite options
    secteursActivite = [
        { label: 'AGRICULTURE', value: 'AGRICULTURE' },
        { label: 'COMMERCE', value: 'COMMERCE' },
        { label: 'ARTISANAT', value: 'ARTISANAT' },
        { label: 'SERVICE', value: 'SERVICE' },
        { label: 'INDUSTRIE', value: 'INDUSTRIE' },
        { label: 'Autre', value: 'Autre' }
    ];

    sousSecteursActivite = [
        { label: 'Habillement', value: 'Habillement' },
        { label: 'Restauration', value: 'Restauration' },
        { label: 'Alimentation', value: 'Alimentation' },
        { label: 'Cosmetique', value: 'Cosmetique' },
        { label: 'Mercerie', value: 'Mercerie' },
        { label: 'Vaisselle-Emaux', value: 'Vaisselle-Emaux' },
        { label: 'Autre', value: 'Autre' }
    ];

    frequenceVentesOptions = [
        { label: 'Journaliere', value: 'Journaliere' },
        { label: 'Hebdomadaire', value: 'Hebdomadaire' },
        { label: 'Mensuelle', value: 'Mensuelle' }
    ];

    // Cycle matrices data
    cycleMensuel = signal<any>({});
    cycleHebdo = signal<any>({});

    months = ['Janv', 'Fevr', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil', 'Aout', 'Sept', 'Oct', 'Nov', 'Dec'];
    days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    cycleLevels = ['Fort', 'Moyen', 'Faible'];

    // Hypothese CA & Type Marge options
    hypotheseCaOptions = [
        { label: 'Hyp. Faib.', value: 'Hyp. Faib.' },
        { label: 'Hyp. Moy.', value: 'Hyp. Moy.' },
        { label: 'Hyp. Elev.', value: 'Hyp. Elev.' }
    ];
    typeMargeOptions = [
        { label: '% Recom.', value: '% Recom.' },
        { label: 'Fort %', value: 'Fort %' },
        { label: 'Faible %', value: 'Faible %' },
        { label: '% Declar', value: '% Declar' }
    ];
    selectedHypotheseCa = 'Hyp. Faib.';
    selectedTypeMarge = '% Recom.';
    caAlternatives: { faible: number; moyen: number; eleve: number } | null = null;
    tauxAlternatives: { recom: number; fort: number; faible: number; declar: number } | null = null;

    // Computed: total charges personnelles
    totalChargesPersonnelles = computed(() => {
        this.formChangeCounter();
        const form = this.section7Form;
        if (!form || form.get('salaireFixe')?.value === true) return 0;
        return (
            (form.get('alimentationMontant')?.value || 0) +
            (form.get('loyerResidenceMontant')?.value || 0) +
            (form.get('transportPriveMontant')?.value || 0) +
            (form.get('electriciteEauCommMontant')?.value || 0) +
            (form.get('habillementMontant')?.value || 0) +
            (form.get('fraisMedicauxMontant')?.value || 0) +
            (form.get('echeanceCreditPersoMontant')?.value || 0) +
            (form.get('scolariteMontant')?.value || 0) +
            (form.get('travauxConstructionMontant')?.value || 0) +
            (form.get('autresChargesPersoMontant')?.value || 0)
        );
    });

    // Computed: total produits ventes / couts / taux marge
    totalProduitsVentes = computed(() => {
        const prods = this.produits();
        return prods.reduce((sum, p) => sum + (p.prixVente || 0) * (p.quantite || 0), 0);
    });

    totalProduitsCouts = computed(() => {
        const prods = this.produits();
        return prods.reduce((sum, p) => sum + (p.coutAchat || 0) * (p.quantite || 0), 0);
    });

    tauxMargeCalcule = computed(() => {
        const ventes = this.totalProduitsVentes();
        if (ventes === 0) return 0;
        return ((ventes - this.totalProduitsCouts()) / ventes) * 100;
    });

    // Computed: total stock articles
    totalStockArticles = computed(() => {
        const articles = this.stockArticles();
        return articles.reduce((sum, a) => sum + (a.quantite || 0) * (a.coutUnitaire || 0), 0);
    });

    // Computed: amortissements totals
    totalAmortValeurAcquisition = computed(() => {
        return this.amortissements().reduce((sum, a) => sum + (a.valeurAcquisition || 0), 0);
    });

    totalAmortMensuel = computed(() => {
        return this.amortissements().reduce((sum, a) => sum + (a.amortissementMensuel || 0), 0);
    });

    totalAmortVNC = computed(() => {
        return this.amortissements().reduce((sum, a) => sum + (a.valeurNetteComptable || 0), 0);
    });

    // ============== MISSING AMORTISSEMENTS (Section 5 → Amorts) ==============
    missingAmortissementTypes = computed(() => {
        const s5 = this.section5Form;
        const amorts = this.amortissements();
        this.formChangeCounter();

        const required: { label: string; type: string }[] = [];

        if (s5.get('batimentExiste')?.value && s5.get('batimentPropriete')?.value)
            required.push({ label: 'b) Batiments et magasin', type: 'Batiments et magasin' });
        if (s5.get('installationExiste')?.value && s5.get('installationPropriete')?.value)
            required.push({ label: 'c) Installations et agencements', type: 'Installations et agencements' });
        if (s5.get('materielRoulantExiste')?.value && s5.get('materielRoulantPropriete')?.value)
            required.push({ label: 'd) Materiel de transport', type: 'Materiel de transport' });
        if (s5.get('mobilierExiste')?.value && s5.get('mobilierPropriete')?.value)
            required.push({ label: 'e) Mobilier de bureau', type: 'Mobilier de bureau' });
        if (s5.get('machineExiste')?.value && s5.get('machinePropriete')?.value)
            required.push({ label: 'f) Materiels industriels', type: 'Materiels industriels' });

        return required.filter(r => !amorts.some(a => a.typeImmobilisation === r.type));
    });

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
    investissementCoutEquipement = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('coutEquipement')?.value || 0;
    });
    investissementDepensesRattachees = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('depensesRattachees')?.value || 0;
    });
    investissementApportPersonnel = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('apportPersonnel')?.value || 0;
    });

    // INVESTISSEMENT - Colonnes Ajustement
    investissementAjustCoutEquipement = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustCoutEquipement')?.value || 0;
    });
    investissementAjustDepensesRattachees = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustDepensesRattachees')?.value || 0;
    });
    investissementAjustApportPersonnel = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustApportPersonnel')?.value || 0;
    });

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
    exploitationCoutAchatCycle = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('coutAchatCycle')?.value || 0;
    });
    exploitationNbreCycles = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('nbreCycleFinancer')?.value || 1;
    });
    exploitationTresorerieDispo = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('tresorerieDisponible')?.value || 0;
    });
    exploitationStockActuel = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('stockActuel')?.value || 0;
    });
    exploitationComptesRecevoir = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('comptesRecevoir')?.value || 0;
    });
    exploitationDettesFournisseurs = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('dettesFournisseurs')?.value || 0;
    });
    exploitationCreditFournisseur = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('creditFournisseur')?.value || 0;
    });

    // EXPLOITATION - Colonnes Ajustement
    exploitationAjustCoutAchat = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustCoutAchatCycle')?.value || 0;
    });
    exploitationAjustTresorerie = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustTresorerieDispo')?.value || 0;
    });
    exploitationAjustStock = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustStockActuel')?.value || 0;
    });
    exploitationAjustComptes = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustComptesRecevoir')?.value || 0;
    });
    exploitationAjustDettes = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustDettesFournisseurs')?.value || 0;
    });
    exploitationAjustCredit = computed(() => {
        this.formChangeCounter();
        return this.besoinCreditForm?.get('ajustCreditFournisseur')?.value || 0;
    });

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
                        this.loadCollecte();
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
                        // Load hypothesis selections from analyse header
                        this.selectedHypotheseCa = analyse.hypotheseCa || 'Hyp. Faib.';
                        this.selectedTypeMarge = analyse.typeMarge || '% Recom.';
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

        // Charger les personnes caution existantes
        this.loadExistingCautions();
    }

    private loadExistingCautions(): void {
        if (!this.demandeIndividuelId) return;
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/synthese/demande/${this.demandeIndividuelId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const cautions = response?.data?.personnesCaution;
                    if (cautions && Array.isArray(cautions) && cautions.length > 0) {
                        this.personnecautions = cautions.map((c: any) => ({
                            personnecautionId: c.personnecautionId,
                            nom: c.nom || '',
                            prenom: c.prenom || '',
                            telephone: c.telephone || '',
                            activite: c.activite || '',
                            age: c.age || null,
                            profession: c.profession || ''
                        }));
                    }
                },
                error: () => {
                    // Pas de cautions existantes, on continue avec un tableau vide
                }
            });
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
            { label: 'Collecte', command: () => this.onStepChange(0) },
            { label: 'Amortissements', command: () => this.onStepChange(1) },
            { label: 'Bilan', command: () => this.onStepChange(2) },
            { label: 'Rentabilité', command: () => this.onStepChange(3) },
            { label: 'Personnes caution', command: () => this.onStepChange(4) },
            { label: 'Besoin Crédit', command: () => this.onStepChange(5) },
            { label: 'Synthèse', command: () => this.onStepChange(6) }
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

        // ============== COLLECTE FORMS ==============
        this.collecteHeaderForm = this.fb.group({
            dateEvaluation: [null],
            activiteDescription: [''],
            secteurActivite: [''],
            sousSecteurActivite: [''],
            sousSousSecteur: ['']
        });

        this.section2Form = this.fb.group({
            capaciteRemboursementDeclaree: [0]
        });

        this.section3Form = this.fb.group({
            caHebdomadaireDeclare: [0],
            caMensuelDeclare: [0],
            caJourFort: [0],
            caJourMoyen: [0],
            caJourFaible: [0],
            cycleMensuelJson: [''],
            cycleHebdoJson: ['']
        });

        this.section4Form = this.fb.group({
            connaitTauxMarge: [false],
            tauxMargeDeclare: [0],
            calculerTauxMarge: [false],
            frequenceVentes: ['']
        });

        this.section5Form = this.fb.group({
            terrainExiste: [false],
            terrainValeur: [0],
            batimentExiste: [false],
            batimentPropriete: [false],
            installationExiste: [false],
            installationPropriete: [false],
            materielRoulantExiste: [false],
            materielRoulantPropriete: [false],
            mobilierExiste: [false],
            mobilierPropriete: [false],
            machineExiste: [false],
            machinePropriete: [false],
            cautionFinanciereExiste: [false],
            cautionFinanciereValeur: [0],
            pretEmployeExiste: [false],
            pretEmployeFondsActivite: [false],
            pretEmployeValeur: [0],
            stockExiste: [false],
            stockConnaitValeur: [false],
            stockValeurEstimee: [0],
            stockEvaluerDetail: [false],
            creditFournisseurExiste: [false],
            creditFournisseurPrevu: [false],
            creditFournisseurValeur: [0],
            creanceClientExiste: [false],
            creancePlus3Mois: [0],
            creanceMoins3Mois: [0],
            cashExiste: [false],
            cashValeur: [0],
            compteCrgExiste: [false],
            compteCrgValeur: [0],
            tontinierExiste: [false],
            tontinierValeur: [0],
            compteBanqueExiste: [false],
            compteBanqueValeur: [0],
            empruntImfExiste: [false],
            empruntImfValeur: [0],
            empruntBancaireLtExiste: [false],
            empruntBancaireLtValeur: [0],
            empruntBancaireCtExiste: [false],
            empruntBancaireCtValeur: [0],
            avanceClientExiste: [false],
            avanceClientValeur: [0],
            detteFournisseurExiste: [false],
            detteFournisseurValeur: [0],
            impotNonPayeExiste: [false],
            impotNonPayeValeur: [0],
            loyerNonPayeExiste: [false],
            loyerNonPayeValeur: [0],
            factureNonPayeeExiste: [false],
            factureNonPayeeValeur: [0],
            tontineDetteExiste: [false],
            tontineDetteValeur: [0],
            autreDetteExiste: [false],
            autreDetteValeur: [0]
        });

        this.section6Form = this.fb.group({
            loyerExiste: [false],
            loyerMontant: [0],
            salaireExiste: [false],
            salaireMontant: [0],
            fournitureExiste: [false],
            fournitureMontant: [0],
            publiciteExiste: [false],
            publiciteMontant: [0],
            telephoneExiste: [false],
            telephoneMontant: [0],
            electriciteExiste: [false],
            electriciteMontant: [0],
            eauExiste: [false],
            eauMontant: [0],
            transportAchatExiste: [false],
            transportAchatMontant: [0],
            transportVenteExiste: [false],
            transportVenteMontant: [0],
            transportDiversExiste: [false],
            transportDiversMontant: [0],
            entretienExiste: [false],
            entretienMontant: [0],
            carburantExiste: [false],
            carburantMontant: [0],
            assuranceExiste: [false],
            assuranceMontant: [0],
            fraisBancairesExiste: [false],
            fraisBancairesMontant: [0],
            interetsEmpruntsExiste: [false],
            interetsEmpruntsMontant: [0],
            impotsTaxesExiste: [false],
            impotsTaxesMontant: [0],
            honorairesExiste: [false],
            honorairesMontant: [0],
            provisionsExiste: [false],
            provisionsMontant: [0],
            echeanceAutreCreditExiste: [false],
            echeanceAutreCreditMontant: [0],
            autresChargesExiste: [false],
            autresChargesMontant: [0]
        });

        this.section7Form = this.fb.group({
            salaireFixe: [true],
            salaireMontant: [0],
            alimentationMontant: [0],
            loyerResidenceMontant: [0],
            transportPriveMontant: [0],
            electriciteEauCommMontant: [0],
            habillementMontant: [0],
            fraisMedicauxMontant: [0],
            echeanceCreditPersoMontant: [0],
            scolariteMontant: [0],
            travauxConstructionMontant: [0],
            autresChargesPersoMontant: [0],
            depensesPreleveesActivite: [false]
        });

        this.section8Form = this.fb.group({
            salaireExterneExiste: [false],
            salaireExterneMontant: [0],
            loyersPercusExiste: [false],
            loyersPercusMontant: [0],
            activiteSecondaireExiste: [false],
            activiteSecondaireMontant: [0],
            autresRevenusExiste: [false],
            autresRevenusMontant: [0]
        });

        this.section9Form = this.fb.group({
            terrainExiste: [false],
            terrainValeur: [0],
            maisonExiste: [false],
            maisonValeur: [0],
            vehiculeExiste: [false],
            vehiculeValeur: [0],
            motoExiste: [false],
            motoValeur: [0],
            autreBienExiste: [false],
            autreBienValeur: [0]
        });

        this.amortissementForm = this.fb.group({
            natureImmobilisation: [''],
            typeImmobilisation: [null],
            dateAcquisition: [null],
            dureeAmortissementMois: [60],
            valeurAcquisition: [0]
        });

        // Subscribe to form valueChanges to trigger computed values recalculation
        this.bilanNForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.bilanN1Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.rentabiliteNForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.rentabiliteN1Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.rentabiliteN2Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.besoinCreditForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.propositionForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.section7Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
        });

        this.section5Form.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
            this.formChangeCounter.update((v) => v + 1);
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

    // ==================== AUTO-REMPLIR DEPUIS COLLECTE ====================

    autoRemplirDepuisCollecte(): void {
        const analyseId = this.state().analyseId;
        const collecteId = this.collecte()?.collecteId;
        if (!analyseId || !collecteId) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Veuillez d'abord creer l'analyse et la collecte"
            });
            return;
        }

        this.loading.set(true);
        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/analyse/${analyseId}/auto-remplir/${collecteId}`, {})
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const data = res?.data?.data || res?.data || res;
                    // Patch Bilan N
                    this.bilanNForm.patchValue({
                        terrains: data.terrain || 0,
                        constructions: data.batimentMagasin || 0,
                        installationsTechniques: data.installationAgencement || 0,
                        materielTransport: data.materielTransport || 0,
                        materielBureau: data.mobilierBureau || 0,
                        autresImmobilisations: (data.autreImmobilisation || 0) + (data.materielIndustriel || 0) + (data.materielInformatique || 0),
                        stocks: data.stocks || 0,
                        creances: data.creancesClients || 0,
                        tresorerieActif: data.tresorerieCaisseBanque || 0,
                        capitauxPropre: data.capitauxPropre || 0,
                        dettesLongTerme: data.empruntLongTerme || 0,
                        dettesCourtTerme: data.empruntCourtTerme || 0,
                        tresoreriePassif: data.autresDettes || 0
                    });
                    // Patch Rentabilite N
                    this.rentabiliteNForm.patchValue({
                        chiffreAffaires: data.chiffreAffaires || 0,
                        coutAchatMarchandises: data.coutAchatMarchandises || 0,
                        salaires: data.salaires || 0,
                        prelevementEntrepreneur: data.prelevementEntrepreneur || 0,
                        loyers: data.loyers || 0,
                        transport: data.transport || 0,
                        electriciteEauTelephone: data.electriciteEauTelephone || 0,
                        fournituresAutresBesoins: data.fournituresAutresBesoins || 0,
                        entretienReparation: data.entretienReparation || 0,
                        carburantLubrifiants: data.carburantLubrifiants || 0,
                        publicitePromotion: data.publicitePromotion || 0,
                        impotsTaxes: data.impotsTaxes || 0,
                        fraisBancairesInterets: data.fraisBancairesInterets || 0,
                        echeanceAutreCredit: data.echeanceAutreCredit || 0,
                        diversesCharges: data.diversesCharges || 0,
                        amortissementsProvisions: data.amortissementsProvisions || 0,
                        autresRevenusHorsActivite: data.autresRevenusHorsActivite || 0
                    });
                    // Patch Besoin Credit
                    this.besoinCreditForm.patchValue({
                        coutAchatCycle: data.coutAchatCycle || 0,
                        tresorerieDisponible: data.tresorerieDisponible || 0,
                        stockActuel: data.stockActuel || 0,
                        comptesRecevoir: data.comptesRecevoir || 0,
                        dettesFournisseurs: data.dettesFournisseurs || 0,
                        creditFournisseur: data.creditFournisseur || 0
                    });
                    // Store CA & margin alternatives for instant switching
                    this.caAlternatives = {
                        faible: data.caHypFaible || 0,
                        moyen: data.caHypMoyen || 0,
                        eleve: data.caHypEleve || 0
                    };
                    this.tauxAlternatives = {
                        recom: data.tauxMargeRecom || 0,
                        fort: data.tauxMargeFort || 0,
                        faible: data.tauxMargeFaible || 0,
                        declar: data.tauxMargeDeclar || 0
                    };
                    this.formChangeCounter.update((c) => c + 1);
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: 'Bilan, Rentabilite et Besoin de credit pre-remplis depuis la collecte'
                    });
                },
                error: (err) => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: err?.error?.message || 'Echec du pre-remplissage depuis la collecte'
                    });
                }
            });
    }

    // ==================== LOAD ALTERNATIVES (on page load) ====================

    private loadAlternatives(collecteId: number): void {
        const analyseId = this.state().analyseId;
        if (!analyseId || !collecteId) return;
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/analyse/${analyseId}/alternatives/${collecteId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (res) => {
                    const alt = res?.data?.alternatives || res?.data || {};
                    this.caAlternatives = {
                        faible: alt.caHypFaible || 0,
                        moyen: alt.caHypMoyen || 0,
                        eleve: alt.caHypEleve || 0
                    };
                    this.tauxAlternatives = {
                        recom: alt.tauxMargeRecom || 0,
                        fort: alt.tauxMargeFort || 0,
                        faible: alt.tauxMargeFaible || 0,
                        declar: alt.tauxMargeDeclar || 0
                    };
                },
                error: () => {
                    // Silently fail - alternatives are optional
                }
            });
    }

    // ==================== HYPOTHESE CA & TYPE MARGE ====================

    onHypotheseCaChange(event: any): void {
        this.selectedHypotheseCa = event.value;
        this.recalculerCA();
        this.saveAnalyseHeader();
    }

    onTypeMargeChange(event: any): void {
        this.selectedTypeMarge = event.value;
        this.recalculerCA();
        this.saveAnalyseHeader();
    }

    private recalculerCA(): void {
        if (!this.caAlternatives || !this.tauxAlternatives) return;

        let ca = 0;
        switch (this.selectedHypotheseCa) {
            case 'Hyp. Elev.':
                ca = this.caAlternatives.eleve;
                break;
            case 'Hyp. Moy.':
                ca = this.caAlternatives.moyen;
                break;
            default:
                ca = this.caAlternatives.faible;
                break;
        }

        let taux = 0;
        switch (this.selectedTypeMarge) {
            case 'Fort %':
                taux = this.tauxAlternatives.fort;
                break;
            case 'Faible %':
                taux = this.tauxAlternatives.faible;
                break;
            case '% Declar':
                taux = this.tauxAlternatives.declar;
                break;
            default:
                taux = this.tauxAlternatives.recom;
                break;
        }

        const marge = (ca * taux) / 100;
        const cout = ca - marge;

        this.rentabiliteNForm.patchValue({
            chiffreAffaires: Math.round(ca),
            coutAchatMarchandises: Math.round(cout)
        });
        this.formChangeCounter.update((c) => c + 1);
    }

    private saveAnalyseHeader(): void {
        const analyseId = this.state().analyseId;
        if (!analyseId) return;
        this.http
            .put(`${this.apiUrl}/ecredit/bilan_finance/analyse/${analyseId}`, {
                hypotheseCa: this.selectedHypotheseCa,
                typeMarge: this.selectedTypeMarge
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
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
        const personnesCautionData = this.personnecautions.map((pc) => ({
            nom: pc.nom || '',
            prenom: pc.prenom || '',
            telephone: pc.telephone || '',
            activite: pc.activite || '',
            age: pc.age || null,
            profession: pc.profession || ''
        }));

        const request = {
            analyseId: analyseId,
            forcerSoumission: this.state().analyseExiste,
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

    // ============== COLLECTE METHODS ==============

    loadCollecte(): void {
        if (!this.demandeIndividuelId) return;
        this.collecteLoading.set(true);
        this.collecteService
            .getCollecteByDemande(this.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const collecteData = response?.data?.collecte;
                    if (collecteData) {
                        this.collecte.set(collecteData);
                        this.collecteSaved.set(true);
                        this.patchCollecteForms(collecteData);
                        if (collecteData.amortissements) {
                            this.amortissements.set(collecteData.amortissements);
                        }
                        // Auto-load CA & margin alternatives for dropdown switching
                        this.loadAlternatives(collecteData.collecteId);
                    }
                    this.collecteLoading.set(false);
                },
                error: () => {
                    this.collecteLoading.set(false);
                }
            });
    }

    createCollecte(): void {
        if (!this.demandeIndividuelId) return;
        this.savingCollecte.set(true);
        const headerValues = this.collecteHeaderForm.value;
        const body = {
            dateEvaluation: headerValues.dateEvaluation ? this.formatDate(headerValues.dateEvaluation) : null,
            activiteDescription: headerValues.activiteDescription,
            secteurActivite: headerValues.secteurActivite,
            sousSecteurActivite: headerValues.sousSecteurActivite,
            sousSousSecteur: headerValues.sousSousSecteur
        };
        this.collecteService
            .createCollecte(this.demandeIndividuelId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const collecteData = response?.data?.collecte;
                    if (collecteData) {
                        this.collecte.set(collecteData);
                        this.collecteSaved.set(true);
                        this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Collecte creee avec succes' });
                    }
                    this.savingCollecte.set(false);
                },
                error: (error) => {
                    this.savingCollecte.set(false);
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error?.error?.message || 'Impossible de creer la collecte' });
                }
            });
    }

    saveCollecteSection(sectionNumber: number): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) {
            this.messageService.add({ severity: 'warn', summary: 'Attention', detail: "Veuillez d'abord creer la collecte" });
            return;
        }
        this.savingCollecte.set(true);

        let obs;
        switch (sectionNumber) {
            case 1:
                obs = this.collecteService.updateSection1(collecteId, this.collecteHeaderForm.value);
                break;
            case 2:
                obs = this.collecteService.updateSection2(collecteId, this.section2Form.value);
                break;
            case 3: {
                const section3Data = {
                    ...this.section3Form.value,
                    cycleMensuelJson: JSON.stringify(this.cycleMensuel()),
                    cycleHebdoJson: JSON.stringify(this.cycleHebdo())
                };
                obs = this.collecteService.updateSection3(collecteId, section3Data);
                break;
            }
            case 4: {
                const margeBruteData = {
                    ...this.section4Form.value,
                    produits: this.produits(),
                    totalCaCalcule: this.totalProduitsVentes(),
                    totalCoutCalcule: this.totalProduitsCouts(),
                    tauxMargeCalcule: this.tauxMargeCalcule()
                };
                obs = this.collecteService.updateSection4(collecteId, margeBruteData);
                break;
            }
            case 5: {
                const raw = { ...this.section5Form.value };
                // Reset valeurs to 0 when *Existe is false
                const existeValeurPairs: [string, string[]][] = [
                    ['terrainExiste', ['terrainValeur']],
                    ['cautionFinanciereExiste', ['cautionFinanciereValeur']],
                    ['pretEmployeExiste', ['pretEmployeValeur']],
                    ['stockExiste', ['stockValeurEstimee']],
                    ['creditFournisseurExiste', ['creditFournisseurValeur']],
                    ['creanceClientExiste', ['creancePlus3Mois', 'creanceMoins3Mois']],
                    ['cashExiste', ['cashValeur']],
                    ['compteCrgExiste', ['compteCrgValeur']],
                    ['tontinierExiste', ['tontinierValeur']],
                    ['compteBanqueExiste', ['compteBanqueValeur']],
                    ['empruntImfExiste', ['empruntImfValeur']],
                    ['empruntBancaireLtExiste', ['empruntBancaireLtValeur']],
                    ['empruntBancaireCtExiste', ['empruntBancaireCtValeur']],
                    ['avanceClientExiste', ['avanceClientValeur']],
                    ['detteFournisseurExiste', ['detteFournisseurValeur']],
                    ['impotNonPayeExiste', ['impotNonPayeValeur']],
                    ['loyerNonPayeExiste', ['loyerNonPayeValeur']],
                    ['factureNonPayeeExiste', ['factureNonPayeeValeur']],
                    ['tontineDetteExiste', ['tontineDetteValeur']],
                    ['autreDetteExiste', ['autreDetteValeur']]
                ];
                for (const [existeKey, valeurKeys] of existeValeurPairs) {
                    if (!raw[existeKey]) {
                        for (const vk of valeurKeys) {
                            raw[vk] = 0;
                        }
                    }
                }
                const actifPassifData = { ...raw, stockArticles: this.stockArticles() };
                obs = this.collecteService.updateSection5(collecteId, actifPassifData);
                break;
            }
            case 6: {
                const raw6 = { ...this.section6Form.value };
                const section6Pairs: [string, string[]][] = [
                    ['loyerExiste', ['loyerMontant']],
                    ['salaireExiste', ['salaireMontant']],
                    ['fournitureExiste', ['fournitureMontant']],
                    ['publiciteExiste', ['publiciteMontant']],
                    ['telephoneExiste', ['telephoneMontant']],
                    ['electriciteExiste', ['electriciteMontant']],
                    ['eauExiste', ['eauMontant']],
                    ['transportAchatExiste', ['transportAchatMontant']],
                    ['transportVenteExiste', ['transportVenteMontant']],
                    ['transportDiversExiste', ['transportDiversMontant']],
                    ['entretienExiste', ['entretienMontant']],
                    ['carburantExiste', ['carburantMontant']],
                    ['assuranceExiste', ['assuranceMontant']],
                    ['fraisBancairesExiste', ['fraisBancairesMontant']],
                    ['interetsEmpruntsExiste', ['interetsEmpruntsMontant']],
                    ['impotsTaxesExiste', ['impotsTaxesMontant']],
                    ['honorairesExiste', ['honorairesMontant']],
                    ['provisionsExiste', ['provisionsMontant']],
                    ['echeanceAutreCreditExiste', ['echeanceAutreCreditMontant']],
                    ['autresChargesExiste', ['autresChargesMontant']]
                ];
                for (const [existeKey, valeurKeys] of section6Pairs) {
                    if (!raw6[existeKey]) {
                        for (const vk of valeurKeys) {
                            raw6[vk] = 0;
                        }
                    }
                }
                obs = this.collecteService.updateSection6(collecteId, raw6);
                break;
            }
            case 7:
                obs = this.collecteService.updateSection7(collecteId, this.section7Form.value);
                break;
            case 8: {
                const raw8 = { ...this.section8Form.value };
                const section8Pairs: [string, string[]][] = [
                    ['salaireExterneExiste', ['salaireExterneMontant']],
                    ['loyersPercusExiste', ['loyersPercusMontant']],
                    ['activiteSecondaireExiste', ['activiteSecondaireMontant']],
                    ['autresRevenusExiste', ['autresRevenusMontant']]
                ];
                for (const [existeKey, valeurKeys] of section8Pairs) {
                    if (!raw8[existeKey]) {
                        for (const vk of valeurKeys) {
                            raw8[vk] = 0;
                        }
                    }
                }
                obs = this.collecteService.updateSection8(collecteId, raw8);
                break;
            }
            case 9: {
                const raw9 = { ...this.section9Form.value };
                const section9Pairs: [string, string[]][] = [
                    ['terrainExiste', ['terrainValeur']],
                    ['maisonExiste', ['maisonValeur']],
                    ['vehiculeExiste', ['vehiculeValeur']],
                    ['motoExiste', ['motoValeur']],
                    ['autreBienExiste', ['autreBienValeur']]
                ];
                for (const [existeKey, valeurKeys] of section9Pairs) {
                    if (!raw9[existeKey]) {
                        for (const vk of valeurKeys) {
                            raw9[vk] = 0;
                        }
                    }
                }
                obs = this.collecteService.updateSection9(collecteId, raw9);
                break;
            }
            default:
                return;
        }

        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: (response) => {
                const collecteData = response?.data?.collecte;
                if (collecteData) {
                    this.collecte.set(collecteData);
                    this.patchCollecteForms(collecteData);
                    if (collecteData.amortissements) {
                        this.amortissements.set(collecteData.amortissements);
                    }
                }
                this.savingCollecte.set(false);
                this.messageService.add({ severity: 'success', summary: 'Succes', detail: `Section ${sectionNumber} enregistree` });
            },
            error: (error) => {
                this.savingCollecte.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error?.error?.message || 'Erreur lors de la sauvegarde' });
            }
        });
    }

    private patchCollecteForms(data: CollecteDonnees): void {
        if (!data) return;

        this.collecteHeaderForm.patchValue({
            dateEvaluation: data.dateEvaluation ? new Date(data.dateEvaluation) : null,
            activiteDescription: data.activiteDescription || '',
            secteurActivite: data.secteurActivite || '',
            sousSecteurActivite: data.sousSecteurActivite || '',
            sousSousSecteur: data.sousSousSecteur || ''
        });

        if (data.conditionCredit) {
            this.section2Form.patchValue({
                capaciteRemboursementDeclaree: data.conditionCredit.capaciteRemboursementDeclaree || 0
            });
        }

        if (data.chiffreAffaires) {
            this.section3Form.patchValue(data.chiffreAffaires);
            // Parse cycle JSON
            if (data.chiffreAffaires.cycleMensuelJson) {
                try {
                    this.cycleMensuel.set(JSON.parse(data.chiffreAffaires.cycleMensuelJson));
                } catch (e) {}
            }
            if (data.chiffreAffaires.cycleHebdoJson) {
                try {
                    this.cycleHebdo.set(JSON.parse(data.chiffreAffaires.cycleHebdoJson));
                } catch (e) {}
            }
        }
        if (data.margeBrute) {
            this.section4Form.patchValue({
                connaitTauxMarge: data.margeBrute.connaitTauxMarge || false,
                tauxMargeDeclare: data.margeBrute.tauxMargeDeclare || 0,
                calculerTauxMarge: data.margeBrute.calculerTauxMarge || false,
                frequenceVentes: data.margeBrute.frequenceVentes || ''
            });
            if (data.margeBrute.produits) {
                this.produits.set(data.margeBrute.produits);
            }
        }
        if (data.actifPassif) {
            this.section5Form.patchValue(data.actifPassif);
            if (data.actifPassif.stockArticles) {
                this.stockArticles.set(data.actifPassif.stockArticles);
            }
        }
        if (data.chargeEntreprise) {
            this.section6Form.patchValue(data.chargeEntreprise);
        }
        if (data.chargePersonnelle) {
            this.section7Form.patchValue(data.chargePersonnelle);
        }
        if (data.autreRevenu) {
            this.section8Form.patchValue(data.autreRevenu);
        }
        if (data.bienPersonnel) {
            this.section9Form.patchValue(data.bienPersonnel);
        }
    }

    // ============== PRODUIT METHODS (Section 4) ==============

    addProduit(): void {
        const current = this.produits();
        this.produits.set([...current, { nomProduit: '', prixVente: 0, coutAchat: 0, quantite: 0, ordre: current.length + 1 }]);
    }

    removeProduit(index: number): void {
        const current = [...this.produits()];
        current.splice(index, 1);
        current.forEach((p, i) => (p.ordre = i + 1));
        this.produits.set(current);
    }

    // ============== STOCK ARTICLE METHODS (Section 5) ==============

    addStockArticle(): void {
        const current = this.stockArticles();
        this.stockArticles.set([...current, { nomArticle: '', quantite: 0, coutUnitaire: 0, ordre: current.length + 1 }]);
    }

    removeStockArticle(index: number): void {
        const current = [...this.stockArticles()];
        current.splice(index, 1);
        current.forEach((s, i) => (s.ordre = i + 1));
        this.stockArticles.set(current);
    }

    // ============== AMORTISSEMENT METHODS ==============

    openNewAmortissement(): void {
        this.editingAmortissement.set(null);
        this.amortissementForm.reset({
            natureImmobilisation: '',
            typeImmobilisation: null,
            dateAcquisition: null,
            dureeAmortissementMois: 60,
            valeurAcquisition: 0
        });
        this.amortissementDialog.set(true);
    }

    editAmortissement(amort: Amortissement): void {
        this.editingAmortissement.set(amort);
        this.amortissementForm.patchValue({
            natureImmobilisation: amort.natureImmobilisation || '',
            typeImmobilisation: amort.typeImmobilisation || null,
            dateAcquisition: amort.dateAcquisition ? new Date(amort.dateAcquisition) : null,
            dureeAmortissementMois: amort.dureeAmortissementMois || 60,
            valeurAcquisition: amort.valeurAcquisition || 0
        });
        this.amortissementDialog.set(true);
    }

    onTypeImmobilisationChange(event: any): void {
        const selected = this.typesImmobilisation.find((t) => t.value === event.value);
        if (selected) {
            this.amortissementForm.patchValue({ dureeAmortissementMois: selected.dureeMois });
        }
    }

    saveAmortissement(): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) return;

        this.savingAmortissement.set(true);
        const formValue = this.amortissementForm.value;
        const body = {
            collecteId: collecteId,
            natureImmobilisation: formValue.natureImmobilisation,
            typeImmobilisation: formValue.typeImmobilisation,
            dateAcquisition: formValue.dateAcquisition ? this.formatDate(formValue.dateAcquisition) : null,
            dureeAmortissementMois: formValue.dureeAmortissementMois,
            valeurAcquisition: formValue.valeurAcquisition
        };

        const editing = this.editingAmortissement();
        const obs = editing?.amortissementId ? this.collecteService.updateAmortissement(editing.amortissementId, body) : this.collecteService.addAmortissement(collecteId, body);

        obs.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
            next: () => {
                this.savingAmortissement.set(false);
                this.amortissementDialog.set(false);
                this.loadAmortissements();
                this.messageService.add({ severity: 'success', summary: 'Succes', detail: editing ? 'Amortissement mis a jour' : 'Amortissement ajoute' });
            },
            error: (error) => {
                this.savingAmortissement.set(false);
                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error?.error?.message || 'Erreur' });
            }
        });
    }

    confirmDeleteAmortissement(amort: Amortissement): void {
        this.confirmationService.confirm({
            message: 'Voulez-vous supprimer cet amortissement ?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (amort.amortissementId) {
                    this.collecteService
                        .deleteAmortissement(amort.amortissementId)
                        .pipe(takeUntilDestroyed(this.destroyRef))
                        .subscribe({
                            next: () => {
                                this.loadAmortissements();
                                this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Amortissement supprime' });
                            },
                            error: (error) => {
                                this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error?.error?.message || 'Erreur' });
                            }
                        });
                }
            }
        });
    }

    loadAmortissements(): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) return;
        this.collecteService
            .getAmortissements(collecteId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const amorts = response?.data?.amortissements || [];
                    this.amortissements.set(this.normalizeAmortDates(amorts));
                }
            });
    }

    recalculerAmortissements(): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) return;
        this.collecteService
            .recalculerAmortissements(collecteId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const amorts = response?.data?.amortissements || [];
                    this.amortissements.set(this.normalizeAmortDates(amorts));
                    this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Amortissements recalcules' });
                },
                error: (error) => {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error?.error?.message || 'Erreur' });
                }
            });
    }

    // ============== CYCLE MATRIX METHODS ==============

    toggleCycleCell(type: 'month' | 'week', item: string, level: string): void {
        const data = type === 'month' ? { ...this.cycleMensuel() } : { ...this.cycleHebdo() };
        // Remove item from all levels
        this.cycleLevels.forEach((l) => {
            if (data[l]) {
                data[l] = data[l].filter((i: string) => i !== item);
            }
        });
        // Add to new level
        if (!data[level]) data[level] = [];
        data[level].push(item);

        if (type === 'month') {
            this.cycleMensuel.set(data);
            this.section3Form.patchValue({ cycleMensuelJson: JSON.stringify(data) });
        } else {
            this.cycleHebdo.set(data);
            this.section3Form.patchValue({ cycleHebdoJson: JSON.stringify(data) });
        }
    }

    getCycleLevel(type: 'month' | 'week', item: string): string | null {
        const data = type === 'month' ? this.cycleMensuel() : this.cycleHebdo();
        for (const level of this.cycleLevels) {
            if (data[level]?.includes(item)) return level;
        }
        return null;
    }

    // ============== INLINE AMORTISSEMENT METHODS ==============

    addAmortissementForType(type: string): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) return;
        const typeInfo = this.typesImmobilisation.find(t => t.value === type);
        const today = new Date().toISOString().split('T')[0];
        const body = {
            collecteId,
            natureImmobilisation: '',
            typeImmobilisation: type,
            dateAcquisition: today,
            dureeAmortissementMois: typeInfo?.dureeMois || 60,
            valeurAcquisition: 0,
            valeurNetteAjustee: null
        };
        this.collecteService
            .addAmortissement(collecteId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.loadAmortissements();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: `Amortissement "${type}" ajoute`
                    });
                },
                error: (err) => this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: err?.error?.message || 'Erreur'
                })
            });
    }

    addAmortissementRow(): void {
        const collecteId = this.collecte()?.collecteId;
        if (!collecteId) return;
        const today = new Date().toISOString().split('T')[0];
        const body = {
            collecteId: collecteId,
            natureImmobilisation: '',
            typeImmobilisation: 'Autres immobilisations',
            dateAcquisition: today,
            dureeAmortissementMois: 60,
            valeurAcquisition: 0,
            valeurNetteAjustee: null
        };
        this.collecteService
            .addAmortissement(collecteId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => this.loadAmortissements(),
                error: (err) => this.messageService.add({ severity: 'error', summary: 'Erreur', detail: err?.error?.message || 'Erreur' })
            });
    }

    updateAmortissementRow(amort: Amortissement): void {
        if (!amort.amortissementId) return;
        const body = {
            collecteId: amort.collecteId,
            natureImmobilisation: amort.natureImmobilisation,
            typeImmobilisation: amort.typeImmobilisation,
            dateAcquisition: amort.dateAcquisition,
            dureeAmortissementMois: amort.dureeAmortissementMois,
            valeurAcquisition: amort.valeurAcquisition,
            valeurNetteAjustee: amort.valeurNetteAjustee || null
        };
        this.collecteService
            .updateAmortissement(amort.amortissementId, body)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const updated = response?.data?.amortissement;
                    if (updated) {
                        this.normalizeAmortDates([updated]);
                        const list = this.amortissements();
                        const idx = list.findIndex(a => a.amortissementId === updated.amortissementId);
                        if (idx >= 0) {
                            list[idx] = updated;
                            this.amortissements.set([...list]);
                        }
                    }
                }
            });
    }

    onAmortTypeChange(amort: Amortissement, typeValue: string): void {
        amort.typeImmobilisation = typeValue;
        const found = this.typesImmobilisation.find((t) => t.value === typeValue);
        if (found) {
            amort.dureeAmortissementMois = found.dureeMois;
        }
        this.updateAmortissementRow(amort);
    }

    deleteAmortissementRow(amort: Amortissement): void {
        if (!amort.amortissementId) return;
        this.collecteService
            .deleteAmortissement(amort.amortissementId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.loadAmortissements();
                    this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Amortissement supprime' });
                }
            });
    }

    getDateFin(amort: Amortissement): string {
        if (!amort.dateAcquisition || !amort.dureeAmortissementMois) return '';
        const date = new Date(amort.dateAcquisition);
        date.setMonth(date.getMonth() + amort.dureeAmortissementMois);
        return date.toISOString().split('T')[0];
    }

    // ==================== SECTION 1: Resolution des codes activite ====================

    isParticulier(): boolean {
        const nc = this.state().demandeIndividuel?.natureClient;
        return !nc || nc.includes('Particulier');
    }

    getActiviteLabel(): string {
        const code = Number(this.state().demandeIndividuel?.typeActivite);
        if (!code) return '-';
        const activite = CreditActiviteData.getActiviteByCode(code);
        return activite ? `${code} - ${activite.libelle}` : `${code}`;
    }

    getSousActiviteLabel(): string {
        const codeActivite = Number(this.state().demandeIndividuel?.typeActivite);
        const codeSous = Number(this.state().demandeIndividuel?.sousActivite);
        if (!codeActivite || !codeSous) return '-';
        const sous = CreditActiviteData.getSousActiviteByCode(codeActivite, codeSous);
        return sous ? `${codeSous} - ${sous.libelle}` : `${codeSous}`;
    }

    getSousSousActiviteLabel(): string {
        const codeActivite = Number(this.state().demandeIndividuel?.typeActivite);
        const codeSous = Number(this.state().demandeIndividuel?.sousActivite);
        const codeSousSous = Number(this.state().demandeIndividuel?.sousSousActivite);
        if (!codeActivite || !codeSous || !codeSousSous) return '-';
        const ssa = CreditActiviteData.SOUS_SOUS_ACTIVITES.find(
            s => s.codeActivite === codeActivite && s.codeSousActivite === codeSous && s.code === codeSousSous
        );
        return ssa ? `${codeSousSous} - ${ssa.libelle}` : `${codeSousSous}`;
    }

    getTotalEmprunte(): number {
        const garanties = this.state().demandeIndividuel?.garanties;
        if (!garanties || garanties.length === 0) return 0;
        return garanties.reduce((total: number, g: any) => total + (g.valeurEmprunte || 0), 0);
    }

    getAmortCategories(): { type: string; count: number; totalVNC: number }[] {
        const items = this.amortissements();
        const map = new Map<string, { count: number; totalVNC: number }>();
        for (const item of items) {
            const type = item.typeImmobilisation || 'Non classifie';
            const existing = map.get(type) || { count: 0, totalVNC: 0 };
            existing.count++;
            existing.totalVNC += item.valeurNetteComptable || 0;
            map.set(type, existing);
        }
        return Array.from(map.entries())
            .filter(([, val]) => val.totalVNC > 0)
            .map(([type, val]) => ({ type, ...val }));
    }

    private formatDate(date: any): string {
        if (!date) return '';
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private normalizeAmortDates(amorts: Amortissement[]): Amortissement[] {
        for (const a of amorts) {
            if (a.dateAcquisition) {
                if (Array.isArray(a.dateAcquisition)) {
                    const arr = a.dateAcquisition as any as number[];
                    a.dateAcquisition = `${arr[0]}-${String(arr[1]).padStart(2, '0')}-${String(arr[2]).padStart(2, '0')}`;
                } else if (typeof a.dateAcquisition === 'string' && a.dateAcquisition.length > 10) {
                    a.dateAcquisition = a.dateAcquisition.substring(0, 10);
                }
            }
        }
        return amorts;
    }
}
