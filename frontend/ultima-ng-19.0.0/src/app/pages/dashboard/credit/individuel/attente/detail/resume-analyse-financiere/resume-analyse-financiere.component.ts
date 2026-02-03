import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
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

@Component({
    selector: 'app-resume-analyse-financiere',
    standalone: true,
    imports: [CommonModule, CardModule, TableModule, TagModule, ButtonModule, ProgressSpinnerModule, ToastModule, DividerModule],
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

    demandeId: number | null = null;

    ngOnInit(): void {
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
        return role === 'MANAGER' || role === 'DA' || role === 'DR' || role === 'RA';
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
