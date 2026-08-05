import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { PrintService, PrintAnalyseData } from '@/service/PrintService';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';

// Interface pour les lignes de tableau avec plusieurs colonnes
interface BilanRowItem {
    label: string;
    valueN: string;
    valueN1: string;
    isTotal?: boolean;
    isHeader?: boolean;
}

interface RentabiliteRowItem {
    label: string;
    valueN: string;
    valueN1: string;
    valueNplus1: string;
    isTotal?: boolean;
    isHeader?: boolean;
}

interface BesoinCreditRowItem {
    label: string;
    montant: string;
    ajustement: string;
    isTotal?: boolean;
    isHeader?: boolean;
}

interface TableDataItem {
    label: string;
    value: string;
    isTotal?: boolean;
    isHeader?: boolean;
}

interface AnalyseSynthese {
    analyseId: number;
    demandeindividuelId: number;
    dateEvaluation: string;
    cycleAffaires: string;
    facteurCycle: number;
    typeCdr: string;
    valeurGarantie: number;
    totalValeurEmprunte: number;

    // Demande data
    montantDemande: number;
    dureeDemande: number;
    nombreEcheance: number;
    echeance: number;
    objectCredit: string;
    periodiciteRemboursement: string;

    // Proposition data
    montantPropose: number;
    dureeProposee: number;
    nombreEcheancePropose: number;
    echeanceProposee: number;

    // ══════════════════════════════════════════════════════════════════════════
    // BILAN - PÉRIODE N (Évaluation actuelle)
    // ══════════════════════════════════════════════════════════════════════════
    terrainN: number;
    batimentMagasinN: number;
    installationAgencementN: number;
    materielIndustrielN: number;
    mobilierBureauN: number;
    materielInformatiqueN: number;
    materielTransportN: number;
    autreImmobilisationN: number;
    stocksN: number;
    creancesClientsN: number;
    tresorerieCaisseBanqueN: number;
    empruntLongTermeN: number;
    empruntCourtTermeN: number;
    autresDettesN: number;
    totalImmobilisationsN: number;
    totalActifN: number;
    totalDettesN: number;
    capitauxPropresN: number;
    fondsRoulementN: number;
    besoinFondsRoulementN: number;

    // ══════════════════════════════════════════════════════════════════════════
    // BILAN - PÉRIODE N-1 (Évaluation précédente)
    // ══════════════════════════════════════════════════════════════════════════
    terrainN1: number;
    batimentMagasinN1: number;
    installationAgencementN1: number;
    materielIndustrielN1: number;
    mobilierBureauN1: number;
    materielInformatiqueN1: number;
    materielTransportN1: number;
    autreImmobilisationN1: number;
    stocksN1: number;
    creancesClientsN1: number;
    tresorerieCaisseBanqueN1: number;
    empruntLongTermeN1: number;
    empruntCourtTermeN1: number;
    autresDettesN1: number;
    totalImmobilisationsN1: number;
    totalActifN1: number;
    totalDettesN1: number;
    capitauxPropresN1: number;
    fondsRoulementN1: number;
    besoinFondsRoulementN1: number;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N
    // ══════════════════════════════════════════════════════════════════════════
    chiffreAffairesN: number;
    coutAchatMarchandisesN: number;
    margeBruteN: number;
    salairesN: number;
    prelevementEntrepreneurN: number;
    loyersN: number;
    transportN: number;
    electriciteEauTelephoneN: number;
    fournituresAutresBesoinsN: number;
    entretienReparationN: number;
    carburantLubrifiantsN: number;
    publicitePromotionN: number;
    impotsTaxesN: number;
    fraisBancairesInteretsN: number;
    echeanceAutreCreditN: number;
    diversesChargesN: number;
    amortissementsProvisionsN: number;
    autresRevenusHorsActiviteN: number;
    totalChargesExploitationN: number;
    resultatExploitationN: number;
    cashFlowN: number;
    capaciteRemboursementN: number;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N-1
    // ══════════════════════════════════════════════════════════════════════════
    chiffreAffairesN1: number;
    coutAchatMarchandisesN1: number;
    margeBruteN1: number;
    salairesN1: number;
    prelevementEntrepreneurN1: number;
    loyersN1: number;
    transportN1: number;
    electriciteEauTelephoneN1: number;
    fournituresAutresBesoinsN1: number;
    entretienReparationN1: number;
    carburantLubrifiantsN1: number;
    publicitePromotionN1: number;
    impotsTaxesN1: number;
    fraisBancairesInteretsN1: number;
    echeanceAutreCreditN1: number;
    diversesChargesN1: number;
    amortissementsProvisionsN1: number;
    autresRevenusHorsActiviteN1: number;
    totalChargesExploitationN1: number;
    resultatExploitationN1: number;
    cashFlowN1: number;
    capaciteRemboursementN1: number;

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - PÉRIODE N+1 (Prévisionnel)
    // ══════════════════════════════════════════════════════════════════════════
    chiffreAffairesNplus1: number;
    coutAchatMarchandisesNplus1: number;
    margeBruteNplus1: number;
    salairesNplus1: number;
    prelevementEntrepreneurNplus1: number;
    loyersNplus1: number;
    transportNplus1: number;
    electriciteEauTelephoneNplus1: number;
    fournituresAutresBesoinsNplus1: number;
    entretienReparationNplus1: number;
    carburantLubrifiantsNplus1: number;
    publicitePromotionNplus1: number;
    impotsTaxesNplus1: number;
    fraisBancairesInteretsNplus1: number;
    echeanceAutreCreditNplus1: number;
    diversesChargesNplus1: number;
    amortissementsProvisionsNplus1: number;
    autresRevenusHorsActiviteNplus1: number;
    totalChargesExploitationNplus1: number;
    resultatExploitationNplus1: number;
    cashFlowNplus1: number;
    capaciteRemboursementNplus1: number;

    // ══════════════════════════════════════════════════════════════════════════
    // BESOIN EN CRÉDIT - Investissement
    // ══════════════════════════════════════════════════════════════════════════
    coutEquipement: number;
    ajustCoutEquipement: number;
    depensesRattachees: number;
    ajustDepensesRattachees: number;
    apportPersonnel: number;
    ajustApportPersonnel: number;
    besoinReelInvestissement: number;

    // ══════════════════════════════════════════════════════════════════════════
    // BESOIN EN CRÉDIT - Exploitation
    // ══════════════════════════════════════════════════════════════════════════
    coutAchatCycle: number;
    ajustCoutAchatCycle: number;
    nbreCycleFinancer: number;
    tresorerieDisponible: number;
    ajustTresorerieDispo: number;
    stockActuel: number;
    ajustStockActuel: number;
    comptesRecevoir: number;
    ajustComptesRecevoir: number;
    dettesFournisseurs: number;
    ajustDettesFournisseurs: number;
    creditFournisseur: number;
    ajustCreditFournisseur: number;
    besoinReelExploitation: number;

    // ══════════════════════════════════════════════════════════════════════════
    // RATIOS CALCULÉS
    // ══════════════════════════════════════════════════════════════════════════
    calcR1Sollicite: number;
    calcR1Propose: number;
    calcR2: number;
    calcR3: number;
    calcR4Sollicite: number;
    calcR4Propose: number;
    calcR5: number;
    calcR6Sollicite: number;
    calcR6Propose: number;
}

type PrimeSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

// ══════ Détail pédagogique d'un ratio (modal au clic) ══════
interface RatioLigne {
    label: string;
    valeur: string;
    source: string;
    isTotal?: boolean;
}

interface RatioApplication {
    titre: string;
    calcul: string;
    resultat: string;
    statut: string;
    severite: PrimeSeverity;
}

interface RatioDetail {
    code: string;
    titre: string;
    norme: string;
    formule: string;
    explication: string;
    composantes: RatioLigne[];
    applications: RatioApplication[];
}

@Component({
    selector: 'app-resume-analyse-financiere',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, TagModule, ButtonModule, ProgressSpinnerModule, ToastModule, DividerModule, DialogModule],
    templateUrl: './resume-analyse-financiere.component.html',
    styleUrl: './resume-analyse-financiere.component.scss',
    providers: [MessageService]
})
export class ResumeAnalyseFinanciereComponent {
    state = signal<{
        user?: IUser;
        synthese?: AnalyseSynthese;
        loading: boolean;
        error: string | null;
    }>({
        loading: false,
        error: null
    });

    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private printService = inject(PrintService);

    demandeId: number | null = null;

    /** Fournir l'ID directement (mode embarqué) au lieu de le lire dans la route. */
    @Input() demandeIdInput?: number;
    /** Mode embarqué : masque l'en-tête (titre + boutons Imprimer/Retour) et n'utilise pas la route. */
    @Input() embedded = false;

    ngOnInit(): void {
        // Mode embarqué (ex. synthèse DE) : l'ID vient d'un @Input, pas de la route.
        if (this.demandeIdInput) {
            this.demandeId = this.demandeIdInput;
            this.chargerSynthese();
            return;
        }

        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.demandeId = +params['demandeId'];

            if (this.demandeId) {
                this.chargerSynthese();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'ID de demande manquant'
                });
            }
        });
    }

    chargerSynthese(): void {
        if (!this.demandeId) return;

        this.state.update((s) => ({ ...s, loading: true, error: null }));

        this.userService
            .getSyntheseAnalyseFinanciere$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const responseData = response.data as any;
                    if (responseData?.synthese) {
                        this.state.update((s) => ({
                            ...s,
                            synthese: responseData.synthese,
                            user: responseData.user,
                            loading: false
                        }));
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            loading: false,
                            error: 'Aucune synthèse trouvée'
                        }));
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        error: error.message || 'Erreur lors du chargement'
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la synthèse'
                    });
                }
            });
    }

    // ========================================
    // Méthodes pour le rôle utilisateur
    // ========================================

    isAgentCredit(): boolean {
        return this.state().user?.role === 'AGENT_CREDIT';
    }

    canViewRatios(): boolean {
        const role = this.state().user?.role;
        return role === 'MANAGER' || role === 'DA' || role === 'DR' || role === 'RA' || role === 'DG';
    }

    // ── Collapse des details : par defaut on n'affiche que les totaux, ─────────────
    //    le detail (lignes non-totales) est depliable par bloc. ──────────────────────
    private detailExpanded = signal<Record<string, boolean>>({});

    toggleDetail(key: string): void {
        this.detailExpanded.update((m) => ({ ...m, [key]: !m[key] }));
    }

    isDetailExpanded(key: string): boolean {
        return !!this.detailExpanded()[key];
    }

    /** Lignes a afficher pour un tableau : uniquement les totaux si replie, tout si deplie. */
    rowsFor(key: string, data: any[] | null | undefined): any[] {
        const rows = data || [];
        return this.isDetailExpanded(key) ? rows : rows.filter((r) => r?.isTotal);
    }

    /**
     * Vérifie si le montant proposé existe et est > 0
     */
    hasMontantPropose(): boolean {
        const montant = this.state().synthese?.montantPropose;
        return montant !== null && montant !== undefined && montant > 0;
    }

    // ========================================
    // Méthodes de formatage
    // ========================================

    formatCurrency(amount: number | null | undefined): string {
        if (amount === null || amount === undefined) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    /**
     * Formate un ratio en pourcentage
     * Si la valeur est déjà en décimal (ex: 2.5), multiplie par 100
     * @param value - Valeur du ratio (décimal)
     */
    formatPercent(value: number | null | undefined): string {
        if (value === null || value === undefined) return '0%';
        return `${(value * 100).toFixed(1)}%`;
    }

    // ========================================
    // Données pour les tableaux
    // ========================================

    getDemandeData(): TableDataItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Objet du crédit', value: s.objectCredit || '-' },
            { label: 'Montant sollicité', value: this.formatCurrency(s.montantDemande) },
            { label: 'Durée sollicitée', value: `${s.dureeDemande || 0} mois` },
            { label: "Nombre d'échéances", value: `${s.nombreEcheance || 0}` },
            { label: 'Échéance mensuelle', value: this.formatCurrency(s.echeance) },
            { label: 'Périodicité', value: s.periodiciteRemboursement || '-' }
        ];
    }

    getAnalyseData(): TableDataItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: "Date d'évaluation", value: s.dateEvaluation || '-' },
            { label: "Cycle d'affaires", value: s.cycleAffaires || '-' },
            { label: 'Facteur de cycle', value: `${s.facteurCycle || 0}` },
            { label: 'Type CDR', value: s.typeCdr || '-' },
            { label: 'Valeur Garantie', value: this.formatCurrency(s.valeurGarantie) }
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // BILAN - Données multi-colonnes (N et N-1)
    // ══════════════════════════════════════════════════════════════════════════

    getBilanActifImmobiliseData(): BilanRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Terrain', valueN: this.formatCurrency(s.terrainN), valueN1: this.formatCurrency(s.terrainN1) },
            { label: 'Bâtiment / Magasin', valueN: this.formatCurrency(s.batimentMagasinN), valueN1: this.formatCurrency(s.batimentMagasinN1) },
            { label: 'Installation / Agencement', valueN: this.formatCurrency(s.installationAgencementN), valueN1: this.formatCurrency(s.installationAgencementN1) },
            { label: 'Matériel Industriel', valueN: this.formatCurrency(s.materielIndustrielN), valueN1: this.formatCurrency(s.materielIndustrielN1) },
            { label: 'Mobilier de Bureau', valueN: this.formatCurrency(s.mobilierBureauN), valueN1: this.formatCurrency(s.mobilierBureauN1) },
            { label: 'Matériel Informatique', valueN: this.formatCurrency(s.materielInformatiqueN), valueN1: this.formatCurrency(s.materielInformatiqueN1) },
            { label: 'Matériel de Transport', valueN: this.formatCurrency(s.materielTransportN), valueN1: this.formatCurrency(s.materielTransportN1) },
            { label: 'Autres Immobilisations', valueN: this.formatCurrency(s.autreImmobilisationN), valueN1: this.formatCurrency(s.autreImmobilisationN1) },
            { label: 'TOTAL IMMOBILISATIONS', valueN: this.formatCurrency(s.totalImmobilisationsN), valueN1: this.formatCurrency(s.totalImmobilisationsN1), isTotal: true }
        ];
    }

    getBilanActifCirculantData(): BilanRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        const totalCirculantN = (s.stocksN || 0) + (s.creancesClientsN || 0) + (s.tresorerieCaisseBanqueN || 0);
        const totalCirculantN1 = (s.stocksN1 || 0) + (s.creancesClientsN1 || 0) + (s.tresorerieCaisseBanqueN1 || 0);

        return [
            { label: 'Stocks', valueN: this.formatCurrency(s.stocksN), valueN1: this.formatCurrency(s.stocksN1) },
            { label: 'Créances Clients', valueN: this.formatCurrency(s.creancesClientsN), valueN1: this.formatCurrency(s.creancesClientsN1) },
            { label: 'Trésorerie (Caisse / Banque)', valueN: this.formatCurrency(s.tresorerieCaisseBanqueN), valueN1: this.formatCurrency(s.tresorerieCaisseBanqueN1) },
            { label: 'TOTAL ACTIF CIRCULANT', valueN: this.formatCurrency(totalCirculantN), valueN1: this.formatCurrency(totalCirculantN1), isTotal: true }
        ];
    }

    getBilanTotalActifData(): BilanRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [{ label: 'TOTAL ACTIF', valueN: this.formatCurrency(s.totalActifN), valueN1: this.formatCurrency(s.totalActifN1), isTotal: true }];
    }

    getBilanPassifData(): BilanRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'CAPITAUX PROPRES', valueN: this.formatCurrency(s.capitauxPropresN), valueN1: this.formatCurrency(s.capitauxPropresN1), isTotal: true },
            { label: 'DETTES', valueN: '', valueN1: '', isHeader: true },
            { label: 'Emprunts Long Terme', valueN: this.formatCurrency(s.empruntLongTermeN), valueN1: this.formatCurrency(s.empruntLongTermeN1) },
            { label: 'Emprunts Court Terme', valueN: this.formatCurrency(s.empruntCourtTermeN), valueN1: this.formatCurrency(s.empruntCourtTermeN1) },
            { label: 'Autres Dettes', valueN: this.formatCurrency(s.autresDettesN), valueN1: this.formatCurrency(s.autresDettesN1) },
            { label: 'TOTAL DETTES', valueN: this.formatCurrency(s.totalDettesN), valueN1: this.formatCurrency(s.totalDettesN1), isTotal: true },
            { label: 'TOTAL PASSIF', valueN: this.formatCurrency(s.totalActifN), valueN1: this.formatCurrency(s.totalActifN1), isTotal: true }
        ];
    }

    getBilanIndicateursData(): BilanRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Fonds de Roulement', valueN: this.formatCurrency(s.fondsRoulementN), valueN1: this.formatCurrency(s.fondsRoulementN1) },
            { label: 'Besoin en Fonds de Roulement', valueN: this.formatCurrency(s.besoinFondsRoulementN), valueN1: this.formatCurrency(s.besoinFondsRoulementN1) }
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RENTABILITÉ - Données multi-colonnes (N, N-1, N+1)
    // ══════════════════════════════════════════════════════════════════════════

    getRentabiliteProduitsData(): RentabiliteRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            {
                label: "Chiffre d'Affaires",
                valueN: this.formatCurrency(s.chiffreAffairesN),
                valueN1: this.formatCurrency(s.chiffreAffairesN1),
                valueNplus1: this.formatCurrency(s.chiffreAffairesNplus1)
            },
            {
                label: "Coût d'Achat des Marchandises",
                valueN: this.formatCurrency(s.coutAchatMarchandisesN),
                valueN1: this.formatCurrency(s.coutAchatMarchandisesN1),
                valueNplus1: this.formatCurrency(s.coutAchatMarchandisesNplus1)
            },
            {
                label: 'MARGE BRUTE',
                valueN: this.formatCurrency(s.margeBruteN),
                valueN1: this.formatCurrency(s.margeBruteN1),
                valueNplus1: this.formatCurrency(s.margeBruteNplus1),
                isTotal: true
            }
        ];
    }

    getRentabiliteChargesData(): RentabiliteRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Salaires', valueN: this.formatCurrency(s.salairesN), valueN1: this.formatCurrency(s.salairesN1), valueNplus1: this.formatCurrency(s.salairesNplus1) },
            { label: 'Prélèvement Entrepreneur', valueN: this.formatCurrency(s.prelevementEntrepreneurN), valueN1: this.formatCurrency(s.prelevementEntrepreneurN1), valueNplus1: this.formatCurrency(s.prelevementEntrepreneurNplus1) },
            { label: 'Loyers', valueN: this.formatCurrency(s.loyersN), valueN1: this.formatCurrency(s.loyersN1), valueNplus1: this.formatCurrency(s.loyersNplus1) },
            { label: 'Transport', valueN: this.formatCurrency(s.transportN), valueN1: this.formatCurrency(s.transportN1), valueNplus1: this.formatCurrency(s.transportNplus1) },
            { label: 'Électricité / Eau / Téléphone', valueN: this.formatCurrency(s.electriciteEauTelephoneN), valueN1: this.formatCurrency(s.electriciteEauTelephoneN1), valueNplus1: this.formatCurrency(s.electriciteEauTelephoneNplus1) },
            { label: 'Fournitures et Autres Besoins', valueN: this.formatCurrency(s.fournituresAutresBesoinsN), valueN1: this.formatCurrency(s.fournituresAutresBesoinsN1), valueNplus1: this.formatCurrency(s.fournituresAutresBesoinsNplus1) },
            { label: 'Entretien / Réparation', valueN: this.formatCurrency(s.entretienReparationN), valueN1: this.formatCurrency(s.entretienReparationN1), valueNplus1: this.formatCurrency(s.entretienReparationNplus1) },
            { label: 'Carburant / Lubrifiants', valueN: this.formatCurrency(s.carburantLubrifiantsN), valueN1: this.formatCurrency(s.carburantLubrifiantsN1), valueNplus1: this.formatCurrency(s.carburantLubrifiantsNplus1) },
            { label: 'Publicité / Promotion', valueN: this.formatCurrency(s.publicitePromotionN), valueN1: this.formatCurrency(s.publicitePromotionN1), valueNplus1: this.formatCurrency(s.publicitePromotionNplus1) },
            { label: 'Impôts et Taxes', valueN: this.formatCurrency(s.impotsTaxesN), valueN1: this.formatCurrency(s.impotsTaxesN1), valueNplus1: this.formatCurrency(s.impotsTaxesNplus1) },
            { label: 'Frais Bancaires / Intérêts', valueN: this.formatCurrency(s.fraisBancairesInteretsN), valueN1: this.formatCurrency(s.fraisBancairesInteretsN1), valueNplus1: this.formatCurrency(s.fraisBancairesInteretsNplus1) },
            { label: 'Échéance Autre Crédit', valueN: this.formatCurrency(s.echeanceAutreCreditN), valueN1: this.formatCurrency(s.echeanceAutreCreditN1), valueNplus1: this.formatCurrency(s.echeanceAutreCreditNplus1) },
            { label: 'Diverses Charges', valueN: this.formatCurrency(s.diversesChargesN), valueN1: this.formatCurrency(s.diversesChargesN1), valueNplus1: this.formatCurrency(s.diversesChargesNplus1) },
            { label: 'TOTAL CHARGES', valueN: this.formatCurrency(s.totalChargesExploitationN), valueN1: this.formatCurrency(s.totalChargesExploitationN1), valueNplus1: this.formatCurrency(s.totalChargesExploitationNplus1), isTotal: true }
        ];
    }

    getRentabiliteResultatsData(): RentabiliteRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Amortissements / Provisions', valueN: this.formatCurrency(s.amortissementsProvisionsN), valueN1: this.formatCurrency(s.amortissementsProvisionsN1), valueNplus1: this.formatCurrency(s.amortissementsProvisionsNplus1) },
            { label: "Résultat d'Exploitation", valueN: this.formatCurrency(s.resultatExploitationN), valueN1: this.formatCurrency(s.resultatExploitationN1), valueNplus1: this.formatCurrency(s.resultatExploitationNplus1), isTotal: true },
            { label: 'Autres Revenus Hors Activité', valueN: this.formatCurrency(s.autresRevenusHorsActiviteN), valueN1: this.formatCurrency(s.autresRevenusHorsActiviteN1), valueNplus1: this.formatCurrency(s.autresRevenusHorsActiviteNplus1) },
            { label: 'CASH FLOW', valueN: this.formatCurrency(s.cashFlowN), valueN1: this.formatCurrency(s.cashFlowN1), valueNplus1: this.formatCurrency(s.cashFlowNplus1), isTotal: true },
            { label: 'CAPACITÉ DE REMBOURSEMENT', valueN: this.formatCurrency(s.capaciteRemboursementN), valueN1: this.formatCurrency(s.capaciteRemboursementN1), valueNplus1: this.formatCurrency(s.capaciteRemboursementNplus1), isTotal: true }
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // BESOIN EN CRÉDIT - Données avec Montant et Ajustement
    // ══════════════════════════════════════════════════════════════════════════

    getBesoinInvestissementData(): BesoinCreditRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Coût Équipement', montant: this.formatCurrency(s.coutEquipement), ajustement: this.formatCurrency(s.ajustCoutEquipement) },
            { label: 'Dépenses Rattachées', montant: this.formatCurrency(s.depensesRattachees), ajustement: this.formatCurrency(s.ajustDepensesRattachees) },
            { label: 'Apport Personnel', montant: this.formatCurrency(s.apportPersonnel), ajustement: this.formatCurrency(s.ajustApportPersonnel) },
            { label: 'BESOIN RÉEL INVESTISSEMENT', montant: this.formatCurrency(s.besoinReelInvestissement), ajustement: '-', isTotal: true }
        ];
    }

    getBesoinExploitationData(): BesoinCreditRowItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'Coût Achat Cycle', montant: this.formatCurrency(s.coutAchatCycle), ajustement: this.formatCurrency(s.ajustCoutAchatCycle) },
            { label: 'Nombre de Cycles à Financer', montant: `${s.nbreCycleFinancer || 0}`, ajustement: '-' },
            { label: 'Trésorerie Disponible', montant: this.formatCurrency(s.tresorerieDisponible), ajustement: this.formatCurrency(s.ajustTresorerieDispo) },
            { label: 'Stock Actuel', montant: this.formatCurrency(s.stockActuel), ajustement: this.formatCurrency(s.ajustStockActuel) },
            { label: 'Comptes à Recevoir', montant: this.formatCurrency(s.comptesRecevoir), ajustement: this.formatCurrency(s.ajustComptesRecevoir) },
            { label: 'Dettes Fournisseurs', montant: this.formatCurrency(s.dettesFournisseurs), ajustement: this.formatCurrency(s.ajustDettesFournisseurs) },
            { label: 'Crédit Fournisseur', montant: this.formatCurrency(s.creditFournisseur), ajustement: this.formatCurrency(s.ajustCreditFournisseur) },
            { label: 'BESOIN RÉEL EXPLOITATION', montant: this.formatCurrency(s.besoinReelExploitation), ajustement: '-', isTotal: true }
        ];
    }

    // ══════════════════════════════════════════════════════════════════════════
    // RATIOS
    // ══════════════════════════════════════════════════════════════════════════

    getRatiosData(): TableDataItem[] {
        const s = this.state().synthese;
        if (!s) return [];

        return [
            { label: 'R1 - Capacité Remboursement (Sollicité)', value: this.formatPercent(s.calcR1Sollicite) },
            { label: 'R1 - Capacité Remboursement (Proposé)', value: this.formatPercent(s.calcR1Propose) },
            { label: 'R2 - Solvabilité', value: this.formatPercent(s.calcR2) },
            { label: 'R3 - Liquidité', value: this.formatPercent(s.calcR3) },
            { label: 'R4 - Endettement (Sollicité)', value: this.formatPercent(s.calcR4Sollicite) },
            { label: 'R4 - Endettement (Proposé)', value: this.formatPercent(s.calcR4Propose) },
            { label: 'R5 - Dépendance', value: this.formatPercent(s.calcR5) },
            { label: 'R6 - Couverture Garantie (Sollicité)', value: this.formatPercent(s.calcR6Sollicite) },
            { label: 'R6 - Couverture Garantie (Proposé)', value: this.formatPercent(s.calcR6Propose) }
        ];
    }

    // ========================================
    // Navigation
    // ========================================

    retour(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail/', this.demandeId]);
    }

    // ========================================
    // Impression
    // ========================================

    imprimerAnalyse(): void {
        const synthese = this.state().synthese;
        if (!synthese) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune donnée à imprimer'
            });
            return;
        }

        const printData: PrintAnalyseData = {
            synthese: synthese as any,
            personnesCaution: [],
            showRatios: this.canViewRatios()
        };

        this.printService.imprimerAnalyseFinanciere(printData, {
            includeRatios: this.canViewRatios(),
            includeSignature: true
        });
    }

    // ════════════════════════════════════════════════════════════════════════════════
    // MÉTHODES POUR LES RATIOS
    // ════════════════════════════════════════════════════════════════════════════════

    /**
     * Détermine le statut d'un ratio (CONFORME / NON CONFORME)
     * @param value - Valeur du ratio (décimal, ex: 2.5 pour 250%)
     * @param threshold - Seuil de comparaison (décimal, ex: 2 pour 200%)
     * @param isGreaterBetter - true si >= seuil = conforme, false si < seuil = conforme
     */
    getStatutRatio(value: number | null | undefined, threshold: number, isGreaterBetter: boolean): string {
        if (value === null || value === undefined) return 'N/A';

        if (isGreaterBetter) {
            return value >= threshold ? 'CONFORME' : 'NON CONFORME';
        } else {
            return value < threshold ? 'CONFORME' : 'NON CONFORME';
        }
    }

    /**
     * Détermine la sévérité (couleur) d'un ratio pour le p-tag
     * @param value - Valeur du ratio (décimal)
     * @param threshold - Seuil de comparaison (décimal)
     * @param isGreaterBetter - true si >= seuil = conforme, false si < seuil = conforme
     */
    getSeveriteRatio(value: number | null | undefined, threshold: number, isGreaterBetter: boolean): PrimeSeverity {
        if (value === null || value === undefined) return 'warn';

        if (isGreaterBetter) {
            return value >= threshold ? 'success' : 'danger';
        } else {
            return value < threshold ? 'success' : 'danger';
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // MODAL DE DÉTAIL D'UN RATIO (clic sur la ligne du ratio)
    // Formules alignées sur la vue SQL v_synthese_analyse (V89), qui fait foi.
    // ══════════════════════════════════════════════════════════════════════════

    showRatioDetail = false;
    ratioDetail: RatioDetail | null = null;

    ouvrirDetailRatio(code: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6'): void {
        const s = this.state().synthese;
        if (!s) return;
        this.ratioDetail = this.buildRatioDetail(code, s);
        this.showRatioDetail = true;
    }

    fermerDetailRatio(): void {
        this.showRatioDetail = false;
        this.ratioDetail = null;
    }

    private application(titre: string, calcul: string, value: number | null | undefined, threshold: number, isGreaterBetter: boolean): RatioApplication {
        return {
            titre,
            calcul,
            resultat: value !== null && value !== undefined ? this.formatPercent(value) : 'Information manquante',
            statut: this.getStatutRatio(value, threshold, isGreaterBetter),
            severite: this.getSeveriteRatio(value, threshold, isGreaterBetter)
        };
    }

    private buildRatioDetail(code: string, s: AnalyseSynthese): RatioDetail {
        const fc = (v: number | null | undefined) => this.formatCurrency(v);
        const RENT = "Rentabilité de l'activité — période N (saisie de l'analyse financière)";
        const BILAN = "Bilan — période N (saisie de l'analyse financière)";
        const DEMANDE = 'Demande de crédit (saisie à la réception)';

        switch (code) {
            case 'R1': {
                const capacite = s.capaciteRemboursementN || 0;
                return {
                    code: 'R.1',
                    titre: 'R.1 Capacité de remboursement calculée',
                    norme: '≥ 200%',
                    formule: 'Capacité de remboursement / Traite  =  (Cash Flow + Autres revenus) / Échéance',
                    explication:
                        "La capacité de remboursement mesure ce que le membre peut réellement consacrer chaque période au remboursement. Elle part du chiffre d'affaires, retire toutes les charges décaissées de l'activité, réintègre les amortissements (charge comptable non décaissée), puis ajoute les revenus hors activité. La norme exige que cette capacité couvre au moins 2 fois la traite.",
                    composantes: [
                        { label: "Chiffre d'affaires", valeur: fc(s.chiffreAffairesN), source: RENT },
                        { label: "− Coût d'achat des marchandises", valeur: fc(s.coutAchatMarchandisesN), source: RENT },
                        { label: '= Marge brute', valeur: fc(s.margeBruteN), source: 'Calculé' },
                        { label: "− Total charges d'exploitation", valeur: fc(s.totalChargesExploitationN), source: 'Somme des charges saisies (salaires, loyers, transport, impôts…)' },
                        { label: '− Amortissements / Provisions', valeur: fc(s.amortissementsProvisionsN), source: RENT },
                        { label: "= Résultat d'exploitation", valeur: fc(s.resultatExploitationN), source: 'Calculé' },
                        { label: '+ Amortissements réintégrés (non décaissés)', valeur: fc(s.amortissementsProvisionsN), source: 'Calculé' },
                        { label: '= Cash Flow', valeur: fc(s.cashFlowN), source: 'Calculé' },
                        { label: '+ Autres revenus hors activité', valeur: fc(s.autresRevenusHorsActiviteN), source: RENT },
                        { label: '= CAPACITÉ DE REMBOURSEMENT', valeur: fc(capacite), source: 'Calculé', isTotal: true },
                        { label: 'Traite (échéance sollicitée)', valeur: fc(s.echeance), source: DEMANDE },
                        ...(this.hasMontantPropose() ? [{ label: 'Traite (échéance proposée)', valeur: fc(s.echeanceProposee), source: "Proposition de l'agent" }] : [])
                    ],
                    applications: [
                        this.application('Montant sollicité', `${fc(capacite)} / ${fc(s.echeance)}`, s.calcR1Sollicite, 2, true),
                        ...(this.hasMontantPropose() ? [this.application('Montant proposé', `${fc(capacite)} / ${fc(s.echeanceProposee)}`, s.calcR1Propose, 2, true)] : [])
                    ]
                };
            }
            case 'R2': {
                return {
                    code: 'R.2',
                    titre: 'R.2 Ratio de solvabilité',
                    norme: '≥ 35%',
                    formule: 'Capitaux propres / Total Actif',
                    explication:
                        "La solvabilité mesure la part du patrimoine de l'activité réellement détenue par le membre (après déduction des dettes). Plus elle est élevée, moins l'activité dépend de financements extérieurs. Les capitaux propres sont obtenus par différence : Total Actif − Total Dettes.",
                    composantes: [
                        { label: 'Total Actif (immobilisations + actif circulant)', valeur: fc(s.totalActifN), source: BILAN },
                        { label: '− Total Dettes (emprunts LT/CT + autres dettes)', valeur: fc(s.totalDettesN), source: BILAN },
                        { label: '= Capitaux propres', valeur: fc(s.capitauxPropresN), source: 'Calculé', isTotal: true }
                    ],
                    applications: [this.application('Période N', `${fc(s.capitauxPropresN)} / ${fc(s.totalActifN)}`, s.calcR2, 0.35, true)]
                };
            }
            case 'R3': {
                const numerateur = (s.creancesClientsN || 0) + (s.tresorerieCaisseBanqueN || 0);
                const denominateur = (s.empruntCourtTermeN || 0) + (s.autresDettesN || 0);
                return {
                    code: 'R.3',
                    titre: 'R.3 Ratio de liquidité à échéance',
                    norme: '≥ 100%',
                    formule: '(Créances clients + Trésorerie) / (Emprunts court terme + Autres dettes)',
                    explication:
                        "La liquidité vérifie que les ressources rapidement mobilisables (argent en caisse/banque + créances à encaisser) suffisent à couvrir les dettes exigibles à court terme. En dessous de 100 %, le membre ne pourrait pas honorer ses dettes immédiates sans vendre des actifs.",
                    composantes: [
                        { label: 'Créances clients', valeur: fc(s.creancesClientsN), source: BILAN },
                        { label: '+ Trésorerie (caisse + banque)', valeur: fc(s.tresorerieCaisseBanqueN), source: BILAN },
                        { label: '= Liquidités mobilisables', valeur: fc(numerateur), source: 'Calculé', isTotal: true },
                        { label: 'Emprunts à court terme', valeur: fc(s.empruntCourtTermeN), source: BILAN },
                        { label: '+ Autres dettes', valeur: fc(s.autresDettesN), source: BILAN },
                        { label: '= Dettes à court terme', valeur: fc(denominateur), source: 'Calculé', isTotal: true }
                    ],
                    applications: [this.application('Période N', `${fc(numerateur)} / ${fc(denominateur)}`, s.calcR3, 1, true)]
                };
            }
            case 'R4': {
                return {
                    code: 'R.4',
                    titre: "R.4 Ratio d'endettement",
                    norme: '< 50%',
                    formule: '(Dettes totales + Crédit) / (Total Actif + Crédit)',
                    explication:
                        "L'endettement simule la situation APRÈS l'octroi du crédit : le montant demandé s'ajoute aux dettes (à rembourser) et à l'actif (l'argent reçu). Si, après octroi, plus de la moitié du patrimoine est financée par des dettes, le dossier est jugé trop endetté.",
                    composantes: [
                        { label: 'Total Dettes actuelles', valeur: fc(s.totalDettesN), source: BILAN },
                        { label: 'Total Actif actuel', valeur: fc(s.totalActifN), source: BILAN },
                        { label: 'Crédit sollicité', valeur: fc(s.montantDemande), source: DEMANDE },
                        ...(this.hasMontantPropose() ? [{ label: 'Crédit proposé', valeur: fc(s.montantPropose), source: "Proposition de l'agent" }] : [])
                    ],
                    applications: [
                        this.application('Montant sollicité', `(${fc(s.totalDettesN)} + ${fc(s.montantDemande)}) / (${fc(s.totalActifN)} + ${fc(s.montantDemande)})`, s.calcR4Sollicite, 0.5, false),
                        ...(this.hasMontantPropose()
                            ? [this.application('Montant proposé', `(${fc(s.totalDettesN)} + ${fc(s.montantPropose)}) / (${fc(s.totalActifN)} + ${fc(s.montantPropose)})`, s.calcR4Propose, 0.5, false)]
                            : [])
                    ]
                };
            }
            case 'R5': {
                const denominateur = (s.resultatExploitationN || 0) + (s.autresRevenusHorsActiviteN || 0);
                return {
                    code: 'R.5',
                    titre: 'R.5 Ratio de dépendance',
                    norme: '< 50%',
                    formule: "Autres revenus / (Résultat d'exploitation + Autres revenus)",
                    explication:
                        "La dépendance mesure la part des revenus nets du membre qui NE provient PAS de l'activité financée (salaire du conjoint, loyers, autre commerce…). Au-delà de 50 %, le remboursement dépendrait majoritairement de sources extérieures à l'activité créditée — que l'institution ne maîtrise pas.",
                    composantes: [
                        { label: "Résultat d'exploitation (marge brute − charges − amortissements)", valeur: fc(s.resultatExploitationN), source: RENT },
                        { label: '+ Autres revenus hors activité', valeur: fc(s.autresRevenusHorsActiviteN), source: RENT },
                        { label: '= Revenus nets totaux', valeur: fc(denominateur), source: 'Calculé', isTotal: true }
                    ],
                    applications: [this.application('Période N', `${fc(s.autresRevenusHorsActiviteN)} / ${fc(denominateur)}`, s.calcR5, 0.5, false)]
                };
            }
            case 'R6':
            default: {
                const garanties = s.totalValeurEmprunte ?? s.valeurGarantie;
                return {
                    code: 'R.6',
                    titre: 'R.6 Ratio de couverture de la garantie',
                    norme: '> 150%',
                    formule: 'Somme des valeurs empruntées des garanties / Crédit',
                    explication:
                        "La couverture vérifie que les garanties proposées valent au moins 1,5 fois le crédit. La valeur retenue pour chaque garantie est sa « valeur empruntée » (valeur prudente, décotée par rapport à la valeur déclarée), sommée sur toutes les garanties du dossier.",
                    composantes: [
                        { label: 'Somme des valeurs empruntées des garanties', valeur: fc(garanties), source: 'Garanties proposées du dossier (valeur empruntée par garantie)' },
                        { label: 'Crédit sollicité', valeur: fc(s.montantDemande), source: DEMANDE },
                        ...(this.hasMontantPropose() ? [{ label: 'Crédit proposé', valeur: fc(s.montantPropose), source: "Proposition de l'agent" }] : [])
                    ],
                    applications: [
                        this.application('Montant sollicité', `${fc(garanties)} / ${fc(s.montantDemande)}`, s.calcR6Sollicite, 1.5, true),
                        ...(this.hasMontantPropose() ? [this.application('Montant proposé', `${fc(garanties)} / ${fc(s.montantPropose)}`, s.calcR6Propose, 1.5, true)] : [])
                    ]
                };
            }
        }
    }

    /**
     * Compte le nombre de ratios conformes pour le montant SOLLICITÉ
     */
    getNbRatiosConformesSollicite(): number {
        const s = this.state().synthese;
        if (!s) return 0;

        let count = 0;

        // R1 Sollicité >= 200% (2.0)
        if (s.calcR1Sollicite !== null && s.calcR1Sollicite !== undefined && s.calcR1Sollicite >= 2) count++;

        // R2 >= 35% (0.35)
        if (s.calcR2 !== null && s.calcR2 !== undefined && s.calcR2 >= 0.35) count++;

        // R3 >= 100% (1.0)
        if (s.calcR3 !== null && s.calcR3 !== undefined && s.calcR3 >= 1) count++;

        // R4 Sollicité < 50% (0.5)
        if (s.calcR4Sollicite !== null && s.calcR4Sollicite !== undefined && s.calcR4Sollicite < 0.5) count++;

        // R5 < 50% (0.5)
        if (s.calcR5 !== null && s.calcR5 !== undefined && s.calcR5 < 0.5) count++;

        // R6 Sollicité > 150% (1.5)
        if (s.calcR6Sollicite !== null && s.calcR6Sollicite !== undefined && s.calcR6Sollicite > 1.5) count++;

        return count;
    }

    /**
     * Compte le nombre de ratios conformes pour le montant PROPOSÉ
     */
    getNbRatiosConformesPropose(): number {
        const s = this.state().synthese;
        if (!s) return 0;

        let count = 0;

        // R1 Proposé >= 200% (2.0)
        if (s.calcR1Propose !== null && s.calcR1Propose !== undefined && s.calcR1Propose >= 2) count++;

        // R2 >= 35% (0.35) - statique
        if (s.calcR2 !== null && s.calcR2 !== undefined && s.calcR2 >= 0.35) count++;

        // R3 >= 100% (1.0) - statique
        if (s.calcR3 !== null && s.calcR3 !== undefined && s.calcR3 >= 1) count++;

        // R4 Proposé < 50% (0.5)
        if (s.calcR4Propose !== null && s.calcR4Propose !== undefined && s.calcR4Propose < 0.5) count++;

        // R5 < 50% (0.5) - statique
        if (s.calcR5 !== null && s.calcR5 !== undefined && s.calcR5 < 0.5) count++;

        // R6 Proposé > 150% (1.5)
        if (s.calcR6Propose !== null && s.calcR6Propose !== undefined && s.calcR6Propose > 1.5) count++;

        return count;
    }

    // ════════════════════════════════════════════════════════════════════════════════
    // NOTE: La méthode formatPercent existante doit être ajustée si nécessaire
    // ════════════════════════════════════════════════════════════════════════════════
}
