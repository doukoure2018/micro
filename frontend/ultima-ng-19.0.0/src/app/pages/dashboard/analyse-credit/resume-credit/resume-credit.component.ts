import { InfoAdministrative } from '@/interface/infoAdministrative';
import { Personnecaution } from '@/interface/personnecaution';
import { IResponse } from '@/interface/response';
import { ResumeCredit } from '@/interface/resumeCredit.model';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MotifAnalyseComponent } from './motif-analyse/motif-analyse.component';
import { IUser } from '@/interface/user';
import { PrintOptions, PrintService } from '@/service/PrintService';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TresoreriePrintService } from '@/service/TresoreriePrintService';
import { ResumeCreditPrintService, ResumePrintOptions } from '@/service/ResumeCreditPrintService';

type PrimeSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';
interface IndicateurCle {
    icon: string;
    label: string;
    value: string;
    severity: PrimeSeverity;
    color: string;
}

interface TableDataItem {
    label: string;
    value: string;
    isTotal?: boolean;
    isRatio?: boolean;
    isStatus?: boolean;
    severity?: PrimeSeverity;
}

@Component({
    selector: 'app-resume-credit',
    imports: [CommonModule, CardModule, PanelModule, TableModule, TagModule, ButtonModule, ProgressSpinnerModule, ToastModule, BadgeModule, DividerModule, SkeletonModule, ProgressBarModule, TooltipModule, AccordionModule, SplitButtonModule],
    templateUrl: './resume-credit.component.html',
    styleUrl: './resume-credit.component.scss',
    providers: [MessageService]
})
export class ResumeCreditComponent {
    state = signal<{
        user?: IUser;
        resumeCredit?: ResumeCredit;
        infoAdministrative?: InfoAdministrative;
        totalValeurEmprunte: number;
        loading: boolean;
        loadingAdmin: boolean;
        message: string | undefined;
        error: string | any;
        searching: boolean;
    }>({
        loading: false,
        message: undefined,
        loadingAdmin: false,
        totalValeurEmprunte: 0,
        error: undefined,
        searching: false
    });

    // Injection des services
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private analyseCreditService = inject(UserService);

    private printService = inject(PrintService);

    private resumePrintService = inject(ResumeCreditPrintService);

    // Paramètres de route
    userId: number | null = null;
    demandeId: number | null = null;

    ngOnInit(): void {
        // Récupérer les paramètres depuis l'URL
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            this.userId = +params['userId'];
            this.demandeId = +params['demandeId'];

            console.log('🔍 Paramètres récupérés - UserId:', this.userId, 'DemandeId:', this.demandeId);

            if (this.demandeId && this.userId) {
                this.chargerResumeCredit();
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Paramètres de navigation manquants'
                });
            }
        });
    }

    // ========================================
    // MÉTHODES DE CHARGEMENT DES DONNÉES
    // ========================================

    chargerResumeCredit(): void {
        if (!this.demandeId) return;

        this.state.update((current) => ({
            ...current,
            loading: true,
            error: undefined
        }));

        console.log('🚀 Chargement du résumé pour la demande:', this.demandeId);

        this.analyseCreditService
            .obtenirResumeCredit$(this.demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('✅ Réponse reçue:', response);

                    if (response.data?.resumeCredit) {
                        this.state.update((current) => ({
                            ...current,
                            resumeCredit: response.data.resumeCredit,
                            user: response.data.user,
                            loading: false,
                            message: 'Résumé chargé avec succès'
                        }));

                        // Charger les infos administratives une fois le résumé chargé
                        this.chargerInfoAdministrative();

                        // Charger la valeur garantie réelle depuis garantie_propose
                        this.chargerValeurGarantie();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Résumé de crédit chargé avec succès'
                        });
                    } else {
                        this.gererErreur('Aucune donnée de résumé trouvée');
                    }
                },
                error: (error) => {
                    this.gererErreur('Erreur lors du chargement du résumé', error);
                }
            });
    }

    chargerValeurGarantie(): void {
        const demandeIndividuelId = this.state().resumeCredit?.demande_credit?.demandeIndividuelId;
        if (!demandeIndividuelId) return;

        this.analyseCreditService
            .getDemandeWithGaranties$(demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    const totalValeurEmprunte = response?.data?.totalValeurEmprunte || 0;
                    this.state.update((current) => ({
                        ...current,
                        totalValeurEmprunte
                    }));
                },
                error: () => {}
            });
    }

    // MÉTHODE CORRIGÉE : Charger les informations administratives
    chargerInfoAdministrative(): void {
        const demande = this.state().resumeCredit?.demande_credit;

        // CORRECTION : Vérification explicite pour accepter 0 comme valeur valide
        if (!demande || demande.delegation_id == null || demande.agence_id == null || demande.point_vente_id == null || demande.user_id == null) {
            console.warn('⚠️ Informations administratives incomplètes dans la demande');
            console.log('🔍 Détails des IDs:', {
                delegation_id: demande?.delegation_id,
                agence_id: demande?.agence_id,
                point_vente_id: demande?.point_vente_id,
                user_id: demande?.user_id
            });
            return;
        }

        this.state.update((current) => ({
            ...current,
            loadingAdmin: true
        }));

        console.log('🏢 Chargement des informations administratives...');
        console.log('📋 IDs utilisés:', {
            delegation_id: demande.delegation_id,
            agence_id: demande.agence_id,
            point_vente_id: demande.point_vente_id,
            user_id: demande.user_id
        });

        this.analyseCreditService
            .getInfoAdministrative$(demande.delegation_id, demande.agence_id, demande.point_vente_id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('✅ Informations administratives reçues:', response);

                    if (response.data?.infoAdministrative) {
                        this.state.update((current) => ({
                            ...current,
                            infoAdministrative: response.data.infoAdministrative,
                            loadingAdmin: false
                        }));

                        console.log('📋 Infos admin chargées:', response.data.infoAdministrative);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Informations administratives chargées'
                        });
                    } else {
                        console.warn('⚠️ Aucune donnée administrative trouvée');
                        this.state.update((current) => ({
                            ...current,
                            loadingAdmin: false
                        }));

                        this.messageService.add({
                            severity: 'warn',
                            summary: 'Attention',
                            detail: 'Structure de données administrative non trouvée'
                        });
                    }
                },
                error: (error) => {
                    console.error('❌ Erreur lors du chargement des infos admin:', error);
                    this.state.update((current) => ({
                        ...current,
                        loadingAdmin: false
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: `Impossible de charger les détails administratifs: ${error.message || 'Erreur inconnue'}`
                    });
                }
            });
    }

    private gererErreur(message: string, error?: any): void {
        this.state.update((current) => ({
            ...current,
            loading: false,
            error: error
        }));

        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message
        });

        console.error('❌ Erreur:', error);
    }

    // ========================================
    // NOUVELLES MÉTHODES - DONNÉES PROPOSITION (demandeindividuel)
    // ========================================

    /**
     * Montant proposé par l'analyste
     */
    getMontantPropose(): number {
        return this.state().resumeCredit?.demande_credit?.montant_propose ?? 0;
    }

    /**
     * Durée proposée en mois
     */
    getDureeProposee(): number {
        return this.state().resumeCredit?.demande_credit?.duree_proposee ?? 0;
    }

    /**
     * Nombre d'échéances proposé
     */
    getNbreEcheancePropose(): number {
        return this.state().resumeCredit?.demande_credit?.nombre_echeance_propose ?? 0;
    }

    /**
     * Échéance proposée (montant mensuel)
     */
    getEcheanceProposee(): number {
        return this.state().resumeCredit?.demande_credit?.echeance_proposee ?? 0;
    }

    // ========================================
    // NOUVELLES MÉTHODES - DONNÉES DEMANDE SOLLICITÉE
    // ========================================

    /**
     * Montant demandé par le membre
     */
    getMontantDemande(): number {
        return this.state().resumeCredit?.demande_credit?.montant_demande ?? 0;
    }

    /**
     * Durée demandée en mois
     */
    getDureeDemande(): number {
        return this.state().resumeCredit?.demande_credit?.duree_mois ?? 0;
    }

    /**
     * Échéance sollicitée (calculée ou stockée)
     */
    getEcheanceDemande(): number {
        return this.state().resumeCredit?.demande_credit?.echeance ?? this.calculerMensualite();
    }

    /**
     * Nombre d'échéances de la demande
     */
    getNbreEcheanceDemande(): number {
        return this.state().resumeCredit?.demande_credit?.nombre_echeance ?? this.getDureeDemande();
    }

    /**
     * Objet du crédit
     */
    getObjetCredit(): string {
        return this.state().resumeCredit?.demande_credit?.objet_financement || 'Non renseigné';
    }

    /**
     * Statut de la demande
     */
    getStatutDemande(): string {
        return this.state().resumeCredit?.demande_credit?.statut ?? 'INCONNU';
    }

    /**
     * Périodicité de remboursement
     */
    getPeriodicite(): string {
        return this.state().resumeCredit?.demande_credit?.periodicite_remboursement ?? 'Mensuelle';
    }

    // ========================================
    // NOUVELLES MÉTHODES - RATIOS PROPOSÉS (R.1, R.4, R.6 dynamiques)
    // ========================================

    /**
     * R.1 Proposé = Capacité de remboursement / Échéance proposée
     * La capacité de remboursement ne change pas, seule l'échéance change
     */
    calculerR1Propose(): string {
        const echeanceProposee = this.getEcheanceProposee();
        if (echeanceProposee <= 0) return 'N/A';

        const capaciteRemb = this.getCashFlow() + this.getAutresRevenus();
        const ratio = (capaciteRemb / echeanceProposee) * 100;
        return ratio.toFixed(1);
    }

    getStatutR1Propose(): string {
        const val = parseFloat(this.calculerR1Propose());
        if (isNaN(val)) return 'Info manquante';
        return val >= 200 ? 'CONFORME' : 'NON CONFORME';
    }

    getSeveriteR1Propose(): PrimeSeverity {
        const val = parseFloat(this.calculerR1Propose());
        if (isNaN(val)) return 'warn';
        return val >= 200 ? 'success' : 'danger';
    }

    /**
     * R.4 Proposé = (Dettes totales + Montant proposé) / (Total Actif + Montant proposé)
     */
    calculerR4Propose(): string {
        const montantPropose = this.getMontantPropose();
        const totalActif = this.getTotalActif();
        const dettesTotales = this.getDettesTotales();
        const denominateur = totalActif + montantPropose;

        if (denominateur <= 0) return 'N/A';

        const ratio = ((dettesTotales + montantPropose) / denominateur) * 100;
        return ratio.toFixed(1);
    }

    getStatutR4Propose(): string {
        const val = parseFloat(this.calculerR4Propose());
        if (isNaN(val)) return 'Info manquante';
        return val < 50 ? 'CONFORME' : 'NON CONFORME';
    }

    getSeveriteR4Propose(): PrimeSeverity {
        const val = parseFloat(this.calculerR4Propose());
        if (isNaN(val)) return 'warn';
        return val < 50 ? 'success' : 'danger';
    }

    /**
     * R.6 Proposé = Valeur garantie / Montant proposé
     */
    calculerR6Propose(): string {
        const montantPropose = this.getMontantPropose();
        if (montantPropose <= 0) return 'N/A';

        const valeurGarantie = this.getValeurGarantie();
        const ratio = (valeurGarantie / montantPropose) * 100;
        return ratio.toFixed(1);
    }

    getStatutR6Propose(): string {
        const val = parseFloat(this.calculerR6Propose());
        if (isNaN(val)) return 'Info manquante';
        return val > 150 ? 'CONFORME' : 'NON CONFORME';
    }

    getSeveriteR6Propose(): PrimeSeverity {
        const val = parseFloat(this.calculerR6Propose());
        if (isNaN(val)) return 'warn';
        return val > 150 ? 'success' : 'danger';
    }

    // ========================================
    // NOUVELLES MÉTHODES - DETTES TOTALES (helper)
    // ========================================

    /**
     * Dettes totales existantes (sans le crédit)
     */
    getDettesTotales(): number {
        const bilan = this.state().resumeCredit?.bilan_entreprise;
        if (!bilan) return 0;

        return (bilan.dettes_fournisseurs ?? 0) + (bilan.emprunts ?? 0);
    }

    // ========================================
    // NOUVELLES MÉTHODES - CONFORMITÉ GLOBALE
    // ========================================

    /**
     * Nombre de seuils respectés pour le montant SOLLICITÉ
     */
    getNbSeuilsRespetesSollicite(): number {
        let count = 0;
        if (parseFloat(this.calculerR1Capacite()) >= 200) count++;
        if (parseFloat(this.calculerR2Solvabilite()) >= 35) count++;
        if (parseFloat(this.calculerR3Liquidite()) >= 100) count++;
        if (parseFloat(this.calculerR4Endettement()) < 50) count++;
        if (parseFloat(this.calculerR5Dependance()) < 50) count++;
        if (parseFloat(this.calculerR6Couverture()) > 150) count++;
        return count;
    }

    /**
     * Nombre de seuils respectés pour le montant PROPOSÉ
     */
    getNbSeuilsRespetesPropose(): number {
        let count = 0;

        // R.1 Proposé (dynamique)
        const r1Propose = parseFloat(this.calculerR1Propose());
        if (!isNaN(r1Propose) && r1Propose >= 200) count++;

        // R.2 Statique (même que sollicité)
        if (parseFloat(this.calculerR2Solvabilite()) >= 35) count++;

        // R.3 Statique (même que sollicité)
        if (parseFloat(this.calculerR3Liquidite()) >= 100) count++;

        // R.4 Proposé (dynamique)
        const r4Propose = parseFloat(this.calculerR4Propose());
        if (!isNaN(r4Propose) && r4Propose < 50) count++;

        // R.5 Statique (même que sollicité)
        if (parseFloat(this.calculerR5Dependance()) < 50) count++;

        // R.6 Proposé (dynamique)
        const r6Propose = parseFloat(this.calculerR6Propose());
        if (!isNaN(r6Propose) && r6Propose > 150) count++;

        return count;
    }

    /**
     * Tous les ratios sont conformes pour le montant sollicité
     */
    allRatiosConformesSollicite(): boolean {
        return this.getNbSeuilsRespetesSollicite() === 6;
    }

    /**
     * Tous les ratios sont conformes pour le montant proposé
     */
    allRatiosConformesPropose(): boolean {
        return this.getNbSeuilsRespetesPropose() === 6;
    }

    // ========================================
    // MÉTHODES DE CALCUL AVEC AUTRES REVENUS
    // ========================================

    calculerTotalActif(): number {
        const bilan = this.state().resumeCredit?.bilan_entreprise;
        if (!bilan) return 0;

        const liquidites = bilan.liquidites || 0;
        const creancesClients = bilan.creances_clients || 0;
        const valeurStocks = bilan.valeur_stocks || 0;
        const valeurEquipements = bilan.valeur_equipements || 0;

        return liquidites + creancesClients + valeurStocks + valeurEquipements;
    }

    calculerTotalPassif(): number {
        const bilan = this.state().resumeCredit?.bilan_entreprise;
        if (!bilan) return 0;

        const dettesFournisseurs = bilan.dettes_fournisseurs || 0;
        const emprunts = bilan.emprunts || 0;
        const capitalPropre = bilan.capital_propre || 0;

        return dettesFournisseurs + emprunts + capitalPropre;
    }

    calculerRatioLiquidite(): number {
        const bilan = this.state().resumeCredit?.bilan_entreprise;
        if (!bilan) return 0;

        const liquidites = bilan.liquidites || 0;
        const creancesClients = bilan.creances_clients || 0;
        const dettesFournisseurs = bilan.dettes_fournisseurs || 0;
        const emprunts = bilan.emprunts || 0;

        const totalDettes = dettesFournisseurs + emprunts;

        return totalDettes > 0 ? (liquidites + creancesClients) / totalDettes : 0;
    }

    // NOUVELLES MÉTHODES POUR LES REVENUS TOTAUX
    calculerRevenusTotauxActuel(): number {
        const exploitation = this.state().resumeCredit?.exploitation_actuelle;
        if (!exploitation) return 0;

        const chiffreAffaires = exploitation.chiffre_affaires || 0;
        const autresRevenus = exploitation.autres_revenus || 0;

        return chiffreAffaires + autresRevenus;
    }

    calculerRevenusTotauxPrevisionnel(): number {
        const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
        if (!exploitation) return 0;

        const chiffreAffaires = exploitation.chiffre_affaires || 0;
        const autresRevenus = exploitation.autres_revenus || 0;

        return chiffreAffaires + autresRevenus;
    }

    // NOUVELLES MÉTHODES POUR LES RATIOS DE DÉPENDANCE
    calculerRatioDependanceActuel(): number {
        const exploitation = this.state().resumeCredit?.exploitation_actuelle;
        if (!exploitation) return 0;

        const revenus = this.calculerRevenusTotauxActuel();
        const autresRevenus = exploitation.autres_revenus || 0;

        return revenus > 0 ? autresRevenus / revenus : 0;
    }

    calculerRatioDependancePrevisionnel(): number {
        const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
        if (!exploitation) return 0;

        const revenus = this.calculerRevenusTotauxPrevisionnel();
        const autresRevenus = exploitation.autres_revenus || 0;

        return revenus > 0 ? autresRevenus / revenus : 0;
    }

    // MÉTHODES DE MARGE BRUTE MODIFIÉES POUR UTILISER REVENUS TOTAUX
    calculerMargeButeActuelle(): number {
        const exploitation = this.state().resumeCredit?.exploitation_actuelle;
        if (!exploitation) return 0;

        const revenus = this.calculerRevenusTotauxActuel();
        const coutMarchandises = exploitation.cout_marchandises || 0;

        return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
    }

    calculerMargeButePrevisionnelle(): number {
        const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
        if (!exploitation) return 0;

        const revenus = this.calculerRevenusTotauxPrevisionnel();
        const coutMarchandises = exploitation.cout_marchandises || 0;

        return revenus > 0 ? (revenus - coutMarchandises) / revenus : 0;
    }

    calculerTotalChargesActuelles(): number {
        const exploitation = this.state().resumeCredit?.exploitation_actuelle;
        if (!exploitation) return 0;

        const coutTransportProduction = exploitation.cout_transport_production || 0;
        const fraisTransportPersonnel = exploitation.frais_transport_personnel || 0;
        const fraisManutention = exploitation.frais_manutention || 0;
        const montantAideExterne = exploitation.montant_aide_externe || 0;
        const fraisHebergementRestauration = exploitation.frais_hebergement_restauration || 0;
        const impots = exploitation.impots || 0;
        const loyers = exploitation.loyers || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    calculerTotalChargesPrevisionnelles(): number {
        const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
        if (!exploitation) return 0;

        const coutTransportProduction = exploitation.cout_transport_production || 0;
        const fraisTransportPersonnel = exploitation.frais_transport_personnel || 0;
        const fraisManutention = exploitation.frais_manutention || 0;
        const montantAideExterne = exploitation.montant_aide_externe || 0;
        const fraisHebergementRestauration = exploitation.frais_hebergement_restauration || 0;
        const impots = exploitation.impots || 0;
        const loyers = exploitation.loyers || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    calculerPatrimoinePersonnel(): number {
        const bilan = this.state().resumeCredit?.bilan_personnel;
        if (!bilan) return 0;

        return (bilan.epargnes || 0) + (bilan.valeur_biens_durables || 0);
    }

    calculerMensualite(): number {
        const demande = this.state().resumeCredit?.demande_credit;
        if (!demande) return 0;

        const montant = demande.montant_demande || 0;
        const duree = demande.duree_mois || 1;

        return montant / duree;
    }

    // RATIO CRÉDIT/CA MODIFIÉ POUR UTILISER REVENUS TOTAUX
    calculerRatioCreditCA(): number {
        const demande = this.state().resumeCredit?.demande_credit;
        if (!demande) return 0;

        const montantDemande = demande.montant_demande || 0;
        const revenus = this.calculerRevenusTotauxPrevisionnel();

        return revenus > 0 ? montantDemande / revenus : 0;
    }

    // ========================================
    // MÉTHODES DE SÉVÉRITÉ POUR LES COULEURS
    // ========================================

    getLiquiditySeverity(ratio: number): PrimeSeverity {
        if (ratio > 2) return 'success';
        if (ratio > 1.2) return 'info';
        if (ratio > 0.8) return 'warn';
        return 'danger';
    }

    getMarginSeverity(margin: number): PrimeSeverity {
        if (margin >= 0.4) return 'success';
        if (margin >= 0.25) return 'info';
        if (margin >= 0.15) return 'warn';
        return 'danger';
    }

    getRatioCreditCASeverity(): PrimeSeverity {
        const ratio = this.calculerRatioCreditCA();
        if (ratio <= 0.5) return 'success';
        if (ratio <= 1) return 'info';
        if (ratio <= 1.5) return 'warn';
        return 'danger';
    }

    // NOUVELLE MÉTHODE POUR LA SÉVÉRITÉ DU RATIO DE DÉPENDANCE
    getRatioDependanceSeverity(ratio: number): PrimeSeverity {
        if (ratio < 0.1) return 'success';
        if (ratio < 0.3) return 'info';
        if (ratio < 0.5) return 'warn';
        return 'danger';
    }

    getStatutSeverity(statut: string): PrimeSeverity {
        switch (statut?.toUpperCase()) {
            case 'EN_ATTENTE':
                return 'warn';
            case 'APPROUVE':
                return 'success';
            case 'REJETE':
                return 'danger';
            case 'EN_COURS':
                return 'info';
            case 'VALIDE':
                return 'success';
            default:
                return 'secondary';
        }
    }

    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================

    formatDateForDisplay(date: Date | string | null): string {
        if (!date) return '';

        let dateObj: Date;

        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return date;
            }
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            return '';
        }

        return dateObj.toLocaleDateString('fr-FR');
    }

    formatCurrency(amount: number | null): string {
        if (amount === null || amount === undefined) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatPercent(value: number): string {
        return new Intl.NumberFormat('fr-FR', {
            style: 'percent',
            minimumFractionDigits: 1,
            maximumFractionDigits: 2
        }).format(value);
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat('fr-FR').format(value);
    }

    // ========================================
    // MÉTHODES DE NAVIGATION
    // ========================================

    retourListe(): void {
        console.log('go back: ', this.state().resumeCredit?.demande_credit!);
        this.router.navigate(['/dashboards/credit/individuel/attente/detail/', this.state().resumeCredit?.demande_credit?.demandeIndividuelId]);
    }

    viewCompleteAnalyse(): void {
        console.log(this.state().resumeCredit?.demande_credit_id!);
        if (this.state().resumeCredit?.demande_credit_id) {
            this.router.navigate([`/dashboards/credit/update-analyse-credit/${this.state().resumeCredit?.demande_credit_id!}`]);
        }
    }

    // ========================================
    // MÉTHODES POUR LES DONNÉES DES TABLEAUX
    // ========================================

    getPromoteurData(): TableDataItem[] {
        const promoteur = this.state().resumeCredit?.promoteur;
        if (!promoteur) return [];

        return [
            { label: 'Nom', value: promoteur.nom || '-' },
            { label: 'Prénom', value: promoteur.prenom || '-' },
            { label: 'Email', value: promoteur.email || '-' },
            { label: 'Téléphone', value: promoteur.telephone || '-' },
            { label: "Numéro d'identité", value: promoteur.numero_identite || '-' },
            { label: 'Date de naissance', value: this.formatDateForDisplay(promoteur.date_naissance) || '-' },
            { label: 'Adresse', value: promoteur.adresse || '-' }
        ];
    }

    getEntrepriseData(): TableDataItem[] {
        const entreprise = this.state().resumeCredit?.entreprise;
        if (!entreprise) return [];

        return [
            { label: 'Nom', value: entreprise.nom || '-' },
            { label: 'Forme juridique', value: entreprise.forme_juridique || '-' },
            { label: "Secteur d'activité", value: entreprise.secteur_activite || '-' },
            { label: 'Date de création', value: this.formatDateForDisplay(entreprise.date_creation) || '-' },
            { label: 'Numéro de registre', value: entreprise.numero_registre || '-' },
            { label: 'Email', value: entreprise.email || '-' },
            { label: 'Téléphone', value: entreprise.telephone || '-' },
            { label: 'Adresse', value: entreprise.adresse || '-' }
        ];
    }

    getBilanEntrepriseData(): TableDataItem[] {
        const bilan = this.state().resumeCredit?.bilan_entreprise;
        if (!bilan) return [];

        return [
            { label: 'Liquidités', value: this.formatCurrency(bilan.liquidites || 0) },
            { label: 'Créances clients', value: this.formatCurrency(bilan.creances_clients || 0) },
            { label: 'Valeur stocks', value: this.formatCurrency(bilan.valeur_stocks || 0) },
            { label: 'Valeur équipements', value: this.formatCurrency(bilan.valeur_equipements || 0) },
            { label: 'Dettes fournisseurs', value: this.formatCurrency(bilan.dettes_fournisseurs || 0) },
            { label: 'Emprunts', value: this.formatCurrency(bilan.emprunts || 0) },
            { label: 'Capital propre', value: this.formatCurrency(bilan.capital_propre || 0) },
            { label: 'Total actif', value: this.formatCurrency(this.calculerTotalActif()), isTotal: true },
            { label: 'Total passif', value: this.formatCurrency(this.calculerTotalPassif()), isTotal: true },
            {
                label: 'Ratio de liquidité',
                value: this.calculerRatioLiquidite().toFixed(2),
                severity: this.getLiquiditySeverity(this.calculerRatioLiquidite()),
                isRatio: true
            }
        ];
    }

    getBilanPersonnelData(): TableDataItem[] {
        const bilan = this.state().resumeCredit?.bilan_personnel;
        if (!bilan) return [];

        return [
            { label: 'Épargnes', value: this.formatCurrency(bilan.epargnes || 0) },
            { label: 'Biens durables', value: this.formatCurrency(bilan.valeur_biens_durables || 0) },
            { label: 'Total patrimoine', value: this.formatCurrency(this.calculerPatrimoinePersonnel()), isTotal: true }
        ];
    }

    // MÉTHODES MODIFIÉES POUR INCLURE LES AUTRES REVENUS
    getExploitationActuelleData(): TableDataItem[] {
        const exploitation = this.state().resumeCredit?.exploitation_actuelle;
        if (!exploitation) return [];

        return [
            { label: 'Période', value: `${this.formatDateForDisplay(exploitation.periode_debut)} - ${this.formatDateForDisplay(exploitation.periode_fin)}` },
            { label: "Chiffre d'affaires", value: this.formatCurrency(exploitation.chiffre_affaires || 0) },
            { label: 'Autres revenus', value: this.formatCurrency(exploitation.autres_revenus || 0) },
            { label: 'Revenus totaux', value: this.formatCurrency(this.calculerRevenusTotauxActuel()), isTotal: true },
            {
                label: 'Ratio de dépendance',
                value: this.formatPercent(this.calculerRatioDependanceActuel()),
                severity: this.getRatioDependanceSeverity(this.calculerRatioDependanceActuel()),
                isRatio: true
            },
            { label: 'Coût marchandises', value: this.formatCurrency(exploitation.cout_marchandises || 0) },
            {
                label: 'Marge brute',
                value: this.formatPercent(this.calculerMargeButeActuelle()),
                severity: this.getMarginSeverity(this.calculerMargeButeActuelle()),
                isRatio: true
            },
            { label: 'Total charges', value: this.formatCurrency(this.calculerTotalChargesActuelles()), isTotal: true }
        ];
    }

    getExploitationPrevisionnelleData(): TableDataItem[] {
        const exploitation = this.state().resumeCredit?.exploitation_previsionnelle;
        if (!exploitation) return [];

        return [
            { label: 'Période', value: `${this.formatDateForDisplay(exploitation.periode_debut)} - ${this.formatDateForDisplay(exploitation.periode_fin)}` },
            { label: "Chiffre d'affaires", value: this.formatCurrency(exploitation.chiffre_affaires || 0) },
            { label: 'Autres revenus', value: this.formatCurrency(exploitation.autres_revenus || 0) },
            { label: 'Revenus totaux', value: this.formatCurrency(this.calculerRevenusTotauxPrevisionnel()), isTotal: true },
            {
                label: 'Ratio de dépendance',
                value: this.formatPercent(this.calculerRatioDependancePrevisionnel()),
                severity: this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),
                isRatio: true
            },
            { label: 'Coût marchandises', value: this.formatCurrency(exploitation.cout_marchandises || 0) },
            {
                label: 'Marge brute',
                value: this.formatPercent(this.calculerMargeButePrevisionnelle()),
                severity: this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),
                isRatio: true
            },
            { label: 'Total charges', value: this.formatCurrency(this.calculerTotalChargesPrevisionnelles()), isTotal: true }
        ];
    }

    getChargesData(type: 'actuelle' | 'previsionnelle'): TableDataItem[] {
        const exploitation = type === 'actuelle' ? this.state().resumeCredit?.exploitation_actuelle : this.state().resumeCredit?.exploitation_previsionnelle;

        if (!exploitation) return [];

        const total = type === 'actuelle' ? this.calculerTotalChargesActuelles() : this.calculerTotalChargesPrevisionnelles();

        return [
            { label: 'Transport production', value: this.formatCurrency(exploitation.cout_transport_production || 0) },
            { label: 'Transport personnel', value: this.formatCurrency(exploitation.frais_transport_personnel || 0) },
            { label: 'Manutention', value: this.formatCurrency(exploitation.frais_manutention || 0) },
            { label: 'Aide externe', value: this.formatCurrency(exploitation.montant_aide_externe || 0) },
            { label: 'Hébergement/Restauration', value: this.formatCurrency(exploitation.frais_hebergement_restauration || 0) },
            { label: 'Impôts', value: this.formatCurrency(exploitation.impots || 0) },
            { label: 'Loyers', value: this.formatCurrency(exploitation.loyers || 0) },
            { label: 'Total charges', value: this.formatCurrency(total), isTotal: true }
        ];
    }

    /**
     * Méthode mise à jour avec les nouvelles colonnes
     */
    getDemandeCreditData(): TableDataItem[] {
        const demande = this.state().resumeCredit?.demande_credit;
        if (!demande) return [];

        return [
            { label: 'Date demande', value: this.formatDateForDisplay(demande.date_demande) || '-' },
            { label: 'Montant demandé', value: this.formatCurrency(demande.montant_demande || 0) },
            { label: 'Durée', value: `${demande.duree_mois || 0} mois` },
            { label: 'Objet du financement', value: demande.objet_financement || '-' },
            { label: 'Mensualité estimée', value: this.formatCurrency(this.calculerMensualite()) },
            {
                label: 'Ratio crédit/Revenus totaux',
                value: this.formatPercent(this.calculerRatioCreditCA()),
                severity: this.getRatioCreditCASeverity(),
                isRatio: true
            },
            { label: 'Statut', value: demande.statut || '-', isStatus: true },
            // NOUVELLES COLONNES
            { label: 'ID Délégation', value: demande.delegation_id ? `${demande.delegation_id}` : 'Non renseigné' },
            { label: 'ID Agence', value: demande.agence_id ? `${demande.agence_id}` : 'Non renseigné' },
            { label: 'ID Point de vente', value: demande.point_vente_id ? `${demande.point_vente_id}` : 'Non renseigné' },
            { label: 'ID Utilisateur', value: demande.user_id ? `${demande.user_id}` : 'Non renseigné' }
        ];
    }

    /**
     * Mise à jour des indicateurs clés pour inclure la garantie
     */
    getIndicateursCles(): IndicateurCle[] {
        const resume = this.state().resumeCredit;
        if (!resume) return [];

        return [
            {
                icon: 'pi pi-chart-line',
                label: 'Marge brute prévisionnelle',
                value: this.formatPercent(this.calculerMargeButePrevisionnelle()),
                severity: this.getMarginSeverity(this.calculerMargeButePrevisionnelle()),
                color: 'blue'
            },
            {
                icon: 'pi pi-money-bill',
                label: 'Ratio de liquidité',
                value: this.calculerRatioLiquidite().toFixed(2),
                severity: this.getLiquiditySeverity(this.calculerRatioLiquidite()),
                color: 'green'
            },
            {
                icon: 'pi pi-percentage',
                label: 'Ratio crédit/Revenus totaux',
                value: this.formatPercent(this.calculerRatioCreditCA()),
                severity: this.getRatioCreditCASeverity(),
                color: 'orange'
            },
            {
                icon: 'pi pi-chart-pie',
                label: 'Ratio de dépendance',
                value: this.formatPercent(this.calculerRatioDependancePrevisionnel()),
                severity: this.getRatioDependanceSeverity(this.calculerRatioDependancePrevisionnel()),
                color: 'red'
            },
            // NOUVEL INDICATEUR : Garantie personnelle
            this.getIndicateurGarantie(),
            {
                icon: 'pi pi-wallet',
                label: 'Patrimoine personnel',
                value: this.formatCurrency(this.calculerPatrimoinePersonnel()),
                severity: 'info' as PrimeSeverity,
                color: 'purple'
            }
        ];
    }

    // ========================================
    // MÉTHODES DE CALCUL DES RATIOS AVEC FORMULES EXACTES
    // ========================================

    // R1 - CAPACITÉ DE REMBOURSEMENT
    // Formule: (Cash Flow + Autres revenus) / (Traite revenus)

    /**
     * Calcule R1 - Capacité de remboursement (SOLLICITÉ)
     */
    calculerR1Capacite(): string {
        const cashFlow = this.getCashFlow();
        const autresRevenus = this.getAutresRevenus();
        const traiteRevenus = this.getTraiteRevenus();

        if (traiteRevenus === 0) return '0.0';

        const ratio = ((cashFlow + autresRevenus) / traiteRevenus) * 100;
        return ratio.toFixed(1);
    }

    getCashFlow(): number {
        const resumeCredit = this.state().resumeCredit;
        if (!resumeCredit) return 0;

        const revenus = this.calculerRevenusTotauxPrevisionnel();
        const charges = this.calculerTotalChargesPrevisionnelles();
        return Math.max(0, revenus - charges);
    }

    getAutresRevenus(): number {
        const resumeCredit = this.state().resumeCredit;
        return resumeCredit?.exploitation_previsionnelle?.autres_revenus || 0;
    }

    getTraiteRevenus(): number {
        // Traite = mensualité de remboursement (échéance sollicitée)
        return this.getEcheanceDemande();
    }

    getStatutR1(): string {
        const ratio = parseFloat(this.calculerR1Capacite());
        if (ratio >= 200) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR1(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR1Capacite());
        if (ratio >= 200) return 'success';
        return 'danger';
    }

    // R2 - RATIO DE SOLVABILITÉ
    // Formule: Capitaux propres / Total Actif

    /**
     * Calcule R2 - Ratio de solvabilité
     */
    calculerR2Solvabilite(): string {
        const capitauxPropres = this.getCapitauxPropres();
        const totalActif = this.getTotalActif();

        if (totalActif === 0) return '0.0';

        const ratio = (capitauxPropres / totalActif) * 100;
        return ratio.toFixed(1);
    }

    getCapitauxPropres(): number {
        const resumeCredit = this.state().resumeCredit;
        return resumeCredit?.bilan_entreprise?.capital_propre || 0;
    }

    getTotalActif(): number {
        return this.calculerTotalActif();
    }

    getStatutR2(): string {
        const ratio = parseFloat(this.calculerR2Solvabilite());
        if (ratio >= 35) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR2(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR2Solvabilite());
        if (ratio >= 35) return 'success';
        return 'danger';
    }

    // R3 - RATIO DE LIQUIDITÉ
    // Formule: (Créances + Trésorerie) / Dettes court terme

    /**
     * Calcule R3 - Ratio de liquidité
     */
    calculerR3Liquidite(): string {
        const creancesEtTresorerie = this.getCreancesEtTresorerie();
        const dettesCourtTerme = this.getDettesCourtTerme();

        if (dettesCourtTerme === 0) return '0.0';

        const ratio = (creancesEtTresorerie / dettesCourtTerme) * 100;
        return ratio.toFixed(1);
    }

    getCreancesEtTresorerie(): number {
        const resumeCredit = this.state().resumeCredit;
        const bilan = resumeCredit?.bilan_entreprise;

        const creances = bilan?.creances_clients || 0;
        const tresorerie = bilan?.liquidites || 0;

        return creances + tresorerie;
    }

    getDettesCourtTerme(): number {
        const resumeCredit = this.state().resumeCredit;
        const bilan = resumeCredit?.bilan_entreprise;

        // Estimation des dettes court terme (part des dettes fournisseurs)
        const dettesFournisseurs = bilan?.dettes_fournisseurs || 0;
        return dettesFournisseurs || 1; // Éviter division par zéro
    }

    getStatutR3(): string {
        const ratio = parseFloat(this.calculerR3Liquidite());
        if (ratio >= 100) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR3(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR3Liquidite());
        if (ratio >= 100) return 'success';
        return 'danger';
    }

    // R4 - RATIO D'ENDETTEMENT
    // Formule: (Dettes totales + Crédit) / (Total Actif + Crédit)

    /**
     * Calcule R4 - Ratio d'endettement (SOLLICITÉ)
     */
    calculerR4Endettement(): string {
        const dettesTotalesAvecCredit = this.getDettesTotalesAvecCredit();
        const totalActifAvecCredit = this.getTotalActifAvecCredit();

        if (totalActifAvecCredit === 0) return '0.0';

        const ratio = (dettesTotalesAvecCredit / totalActifAvecCredit) * 100;
        return ratio.toFixed(1);
    }

    getDettesTotalesAvecCredit(): number {
        const resumeCredit = this.state().resumeCredit;
        const bilan = resumeCredit?.bilan_entreprise;

        const dettesTotales = (bilan?.dettes_fournisseurs || 0) + (bilan?.emprunts || 0);
        const montantCredit = resumeCredit?.demande_credit?.montant_demande || 0;

        return dettesTotales + montantCredit;
    }

    getTotalActifAvecCredit(): number {
        const totalActif = this.calculerTotalActif();
        const resumeCredit = this.state().resumeCredit;
        const montantCredit = resumeCredit?.demande_credit?.montant_demande || 0;

        return totalActif + montantCredit;
    }

    getStatutR4(): string {
        const ratio = parseFloat(this.calculerR4Endettement());
        if (ratio < 50) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR4(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR4Endettement());
        if (ratio < 50) return 'success';
        return 'danger';
    }

    // R5 - RATIO DE DÉPENDANCE
    // Formule: Autres revenus / Revenus totaux

    /**
     * Calcule R5 - Ratio de dépendance
     */
    calculerR5Dependance(): string {
        const autresRevenus = this.getAutresRevenus();
        const revenusTorauxPrevisionnel = this.getRevenusTorauxPrevisionnel();

        if (revenusTorauxPrevisionnel === 0) return '0.0';

        const ratio = (autresRevenus / revenusTorauxPrevisionnel) * 100;
        return ratio.toFixed(1);
    }

    getRevenusTorauxPrevisionnel(): number {
        return this.calculerRevenusTotauxPrevisionnel();
    }

    getStatutR5(): string {
        const ratio = parseFloat(this.calculerR5Dependance());
        if (ratio < 50) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR5(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR5Dependance());
        if (ratio < 50) return 'success';
        return 'danger';
    }

    // R6 - RATIO DE COUVERTURE DE LA GARANTIE
    // Formule: Valeur de la garantie / Crédit

    /**
     * Calcule R6 - Ratio de couverture de la garantie (SOLLICITÉ)
     */
    calculerR6Couverture(): string {
        const valeurGarantie = this.getValeurGarantie();
        const montantCredit = this.getMontantCredit();

        if (montantCredit === 0) return '0.0';

        const ratio = (valeurGarantie / montantCredit) * 100;
        return ratio.toFixed(1);
    }

    /**
     * Valeur de garantie = SUM(valeur_emprunte) depuis la table garantie_propose
     */
    getValeurGarantie(): number {
        return this.state().totalValeurEmprunte;
    }

    getMontantCredit(): number {
        const resumeCredit = this.state().resumeCredit;
        return resumeCredit?.demande_credit?.montant_demande || 0;
    }

    getStatutR6(): string {
        const ratio = parseFloat(this.calculerR6Couverture());
        if (ratio > 150) return 'CONFORME';
        return 'NON CONFORME';
    }

    getSeveriteR6(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR6Couverture());
        if (ratio > 150) return 'success';
        return 'danger';
    }

    // ========================================
    // MÉTHODES D'ÉVALUATION GLOBALE
    // ========================================

    /**
     * Évaluation globale basée sur tous les ratios
     */
    getEvaluationGlobale(): string {
        const nbConformes = this.getNbSeuilsRespetes();

        if (nbConformes >= 6) return 'EXCELLENT';
        if (nbConformes >= 5) return 'BON';
        if (nbConformes >= 4) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    /**
     * Couleur de l'évaluation globale
     */
    getCouleurEvaluationGlobale(): string {
        const evaluation = this.getEvaluationGlobale();
        switch (evaluation) {
            case 'EXCELLENT':
                return 'text-green-600';
            case 'BON':
                return 'text-blue-600';
            case 'ACCEPTABLE':
                return 'text-orange-600';
            case 'RISQUE':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    /**
     * Nombre de seuils respectés (version générique utilisée pour l'évaluation globale)
     */
    getNbSeuilsRespetes(): number {
        return this.getNbSeuilsRespetesSollicite();
    }

    // ========================================
    // MÉTHODES D'ANALYSE DÉTAILLÉE
    // ========================================

    /**
     * Obtient un résumé détaillé de tous les ratios
     */
    getResumeRatios(): any {
        return {
            R1: {
                nom: 'Capacité de remboursement',
                valeur: this.calculerR1Capacite(),
                statut: this.getStatutR1(),
                formule: '(Cash Flow + Autres revenus) / Traite revenus'
            },
            R2: {
                nom: 'Ratio de solvabilité',
                valeur: this.calculerR2Solvabilite(),
                statut: this.getStatutR2(),
                formule: 'Capitaux propres / Total Actif'
            },
            R3: {
                nom: 'Ratio de liquidité',
                valeur: this.calculerR3Liquidite(),
                statut: this.getStatutR3(),
                formule: '(Créances + Trésorerie) / Dettes court terme'
            },
            R4: {
                nom: "Ratio d'endettement",
                valeur: this.calculerR4Endettement(),
                statut: this.getStatutR4(),
                formule: '(Dettes totales + Crédit) / (Total Actif + Crédit)'
            },
            R5: {
                nom: 'Ratio de dépendance',
                valeur: this.calculerR5Dependance(),
                statut: this.getStatutR5(),
                formule: 'Autres revenus / Revenus totaux'
            },
            R6: {
                nom: 'Ratio de couverture',
                valeur: this.calculerR6Couverture(),
                statut: this.getStatutR6(),
                formule: 'Valeur de la garantie / Crédit'
            }
        };
    }

    /**
     * Export des données pour analyse externe
     */
    exporterAnalyse(): any {
        const resume = this.getResumeRatios();
        const evaluation = this.getEvaluationGlobale();
        const nbSeuils = this.getNbSeuilsRespetes();

        return {
            date_analyse: new Date().toISOString(),
            evaluation_globale: evaluation,
            seuils_respectes: `${nbSeuils}/6`,
            ratios: resume,
            montant_demande: this.getMontantCredit(),
            recommandations: this.getRecommandations()
        };
    }

    // ========================================
    // MÉTHODE MANQUANTE : getRecommandations()
    // ========================================

    /**
     * Génère des recommandations basées sur l'analyse des ratios
     */
    getRecommandations(): string[] {
        const recommendations: string[] = [];

        // Analyse R1 - Capacité de remboursement
        const r1 = parseFloat(this.calculerR1Capacite());
        if (r1 < 200) {
            recommendations.push('• Améliorer la capacité de remboursement (ratio < 200%)');
        }

        // Analyse R2 - Solvabilité
        const r2 = parseFloat(this.calculerR2Solvabilite());
        if (r2 < 35) {
            recommendations.push('• Renforcer les capitaux propres (ratio < 35%)');
        }

        // Analyse R3 - Liquidité
        const r3 = parseFloat(this.calculerR3Liquidite());
        if (r3 < 100) {
            recommendations.push('• Améliorer la gestion de trésorerie (ratio < 100%)');
        }

        // Analyse R4 - Endettement
        const r4 = parseFloat(this.calculerR4Endettement());
        if (r4 >= 50) {
            recommendations.push("• Réduire le niveau d'endettement (ratio >= 50%)");
        }

        // Analyse R5 - Dépendance
        const r5 = parseFloat(this.calculerR5Dependance());
        if (r5 >= 50) {
            recommendations.push('• Diversifier les sources de revenus (ratio >= 50%)');
        }

        // Analyse R6 - Couverture
        const r6 = parseFloat(this.calculerR6Couverture());
        if (r6 <= 150) {
            recommendations.push('• Renforcer les garanties ou réduire le montant (ratio <= 150%)');
        }

        // Si tous les ratios sont bons
        if (recommendations.length === 0) {
            recommendations.push('✅ Tous les indicateurs sont dans les normes');
            recommendations.push('✅ Le profil de risque est satisfaisant');
            recommendations.push('✅ La demande de crédit peut être considérée favorablement');
        }

        return recommendations;
    }

    // ========================================
    // MÉTHODES UTILITAIRES SUPPLÉMENTAIRES
    // ========================================

    /**
     * Analyse de risque détaillée
     */
    getAnalyseRisque(): { niveau: string; score: number; facteurs: string[] } {
        const evaluation = this.getEvaluationGlobale();
        const score = this.getScoreRisque();
        const facteurs: string[] = [];

        // Identifier les facteurs de risque
        if (parseFloat(this.calculerR1Capacite()) < 200) {
            facteurs.push('Capacité de remboursement insuffisante (< 200%)');
        }
        if (parseFloat(this.calculerR5Dependance()) >= 50) {
            facteurs.push('Forte dépendance aux autres revenus (>= 50%)');
        }
        if (parseFloat(this.calculerR4Endettement()) >= 50) {
            facteurs.push("Niveau d'endettement élevé (>= 50%)");
        }
        if (parseFloat(this.calculerR3Liquidite()) < 100) {
            facteurs.push('Liquidité insuffisante (< 100%)');
        }
        if (parseFloat(this.calculerR2Solvabilite()) < 35) {
            facteurs.push('Solvabilité insuffisante (< 35%)');
        }
        if (parseFloat(this.calculerR6Couverture()) <= 150) {
            facteurs.push('Couverture de garantie insuffisante (<= 150%)');
        }

        if (facteurs.length === 0) {
            facteurs.push('Aucun facteur de risque majeur identifié');
        }

        return {
            niveau: evaluation,
            score: score,
            facteurs: facteurs
        };
    }

    /**
     * Score de risque (0-100, 100 = meilleur)
     */
    getScoreRisque(): number {
        // Calcul basé sur le nombre de seuils respectés
        const nbConformes = this.getNbSeuilsRespetes();
        return Math.round((nbConformes / 6) * 100);
    }

    /**
     * Obtient des conseils d'amélioration spécifiques
     */
    getConseilsAmelioration(): string[] {
        const conseils: string[] = [];

        const r1 = parseFloat(this.calculerR1Capacite());
        const r2 = parseFloat(this.calculerR2Solvabilite());
        const r3 = parseFloat(this.calculerR3Liquidite());
        const r4 = parseFloat(this.calculerR4Endettement());
        const r5 = parseFloat(this.calculerR5Dependance());
        const r6 = parseFloat(this.calculerR6Couverture());

        // Conseils spécifiques par ratio
        if (r1 < 200) {
            conseils.push('📈 Augmenter les revenus ou optimiser les charges pour améliorer le cash flow');
        }

        if (r2 < 35) {
            conseils.push('💰 Envisager un apport en capital ou réduire les distributions');
        }

        if (r3 < 100) {
            conseils.push('💧 Accélérer le recouvrement des créances et optimiser la trésorerie');
        }

        if (r4 >= 50) {
            conseils.push('📉 Planifier un désendettement progressif avant la nouvelle demande');
        }

        if (r5 >= 50) {
            conseils.push("🎯 Développer le chiffre d'affaires principal pour réduire la dépendance");
        }

        if (r6 <= 150) {
            conseils.push('🛡️ Constituer des garanties supplémentaires ou réduire le montant');
        }

        return conseils;
    }

    /**
     * Évaluation finale avec recommandation de décision
     */
    getRecommandationDecision(): {
        decision: 'ACCORDER' | 'ACCORDER_AVEC_CONDITIONS' | 'REFUSER' | 'ETUDE_APPROFONDIE';
        conditions?: string[];
        justification: string;
    } {
        const evaluation = this.getEvaluationGlobale();
        const nbSeuilsRespetes = this.getNbSeuilsRespetes();

        if (nbSeuilsRespetes === 6) {
            return {
                decision: 'ACCORDER',
                justification: 'Tous les ratios sont conformes aux normes'
            };
        }

        if (nbSeuilsRespetes >= 5) {
            return {
                decision: 'ACCORDER_AVEC_CONDITIONS',
                conditions: ['Suivi trimestriel des ratios financiers', 'Maintien des garanties pendant toute la durée'],
                justification: "Profil de risque acceptable avec quelques points d'attention"
            };
        }

        if (nbSeuilsRespetes >= 4) {
            return {
                decision: 'ETUDE_APPROFONDIE',
                conditions: ['Audit financier complémentaire', "Plan d'amélioration des ratios défaillants", 'Garanties renforcées'],
                justification: 'Profil nécessitant une analyse approfondie avant décision'
            };
        }

        return {
            decision: 'REFUSER',
            justification: 'Profil de risque trop élevé, indicateurs financiers insuffisants'
        };
    }

    // ========================================
    // MÉTHODES UTILITAIRES POUR LE TEMPLATE
    // ========================================

    /**
     * Sévérité pour la décision recommandée
     */
    getDecisionSeverity(): PrimeSeverity {
        const decision = this.getRecommandationDecision().decision;
        switch (decision) {
            case 'ACCORDER':
                return 'success';
            case 'ACCORDER_AVEC_CONDITIONS':
                return 'info';
            case 'ETUDE_APPROFONDIE':
                return 'warn';
            case 'REFUSER':
                return 'danger';
            default:
                return 'secondary';
        }
    }

    /**
     * Test complet de l'analyse (pour debug)
     */
    testerAnalyseComplete(): void {
        console.log('=== ANALYSE COMPLÈTE DES RATIOS ===');

        // Ratios individuels
        console.log('\n1. RATIOS SOLLICITÉS:');
        console.log('R1 - Capacité:', this.calculerR1Capacite() + '%', '(' + this.getStatutR1() + ')');
        console.log('R2 - Solvabilité:', this.calculerR2Solvabilite() + '%', '(' + this.getStatutR2() + ')');
        console.log('R3 - Liquidité:', this.calculerR3Liquidite() + '%', '(' + this.getStatutR3() + ')');
        console.log('R4 - Endettement:', this.calculerR4Endettement() + '%', '(' + this.getStatutR4() + ')');
        console.log('R5 - Dépendance:', this.calculerR5Dependance() + '%', '(' + this.getStatutR5() + ')');
        console.log('R6 - Couverture:', this.calculerR6Couverture() + '%', '(' + this.getStatutR6() + ')');

        console.log('\n2. RATIOS PROPOSÉS:');
        console.log('R1 Proposé:', this.calculerR1Propose() + '%', '(' + this.getStatutR1Propose() + ')');
        console.log('R4 Proposé:', this.calculerR4Propose() + '%', '(' + this.getStatutR4Propose() + ')');
        console.log('R6 Proposé:', this.calculerR6Propose() + '%', '(' + this.getStatutR6Propose() + ')');

        // Évaluation globale
        console.log('\n3. ÉVALUATION GLOBALE:');
        console.log('Statut:', this.getEvaluationGlobale());
        console.log('Score de risque:', this.getScoreRisque() + '/100');
        console.log('Seuils respectés Sollicité:', this.getNbSeuilsRespetesSollicite() + '/6');
        console.log('Seuils respectés Proposé:', this.getNbSeuilsRespetesPropose() + '/6');

        // Recommandations
        console.log('\n4. RECOMMANDATIONS:');
        this.getRecommandations().forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
        });

        // Analyse de risque
        console.log('\n5. ANALYSE DE RISQUE:');
        const analyseRisque = this.getAnalyseRisque();
        console.log('Niveau:', analyseRisque.niveau);
        console.log('Facteurs de risque:', analyseRisque.facteurs);

        // Décision recommandée
        console.log('\n6. DÉCISION RECOMMANDÉE:');
        const decision = this.getRecommandationDecision();
        console.log('Décision:', decision.decision);
        console.log('Justification:', decision.justification);
        if (decision.conditions) {
            console.log('Conditions:', decision.conditions);
        }

        // Toast notification
        this.messageService.add({
            severity: 'info',
            summary: 'Test terminé',
            detail: 'Vérifiez la console pour les résultats détaillés'
        });
    }

    /**
     * Export de l'analyse complète incluant les personnes caution
     */

    exporterAnalyseComplete(): void {
        const infoAdmin = this.state().infoAdministrative;

        const analyseComplete = {
            // Informations générales
            date_analyse: new Date().toISOString(),
            montant_demande: this.formatCurrency(this.getMontantCredit()),

            // Personnes caution (existant)
            personnes_caution: {
                nombre: this.getNombrePersonnesCaution(),
                liste: this.state().resumeCredit?.personnes_caution || [],
                analyse_garantie: this.getAnalyseGarantiePersonnelle()
            },

            // INFORMATIONS ADMINISTRATIVES CORRIGÉES
            informations_administratives: infoAdmin
                ? {
                      delegation: {
                          id: infoAdmin.delegationDto.id,
                          libele: infoAdmin.delegationDto.libele
                      },
                      agence: {
                          id: infoAdmin.agenceDto.id,
                          libele: infoAdmin.agenceDto.libele,
                          delegation_id: infoAdmin.agenceDto.delegation_id
                      },
                      point_vente: {
                          id: infoAdmin.pointVenteDto.id,
                          libele: infoAdmin.pointVenteDto.libele,
                          code: infoAdmin.pointVenteDto.code,
                          delegation_id: infoAdmin.pointVenteDto.delegation_id,
                          agence_id: infoAdmin.pointVenteDto.agence_id
                      },
                      utilisateur_traitant: {
                          userId: infoAdmin.user.userId,
                          firstName: infoAdmin.user.firstName,
                          lastName: infoAdmin.user.lastName,
                          email: infoAdmin.user.email,
                          username: infoAdmin.user.username,
                          phone: infoAdmin.user.phone,
                          role: infoAdmin.user.role,
                          lastLogin: infoAdmin.user.lastLogin,
                          enabled: infoAdmin.user.enabled
                      },
                      resume_hierarchique: this.getResumeAdministratif()
                  }
                : {
                      message: 'Informations administratives non disponibles',
                      fallback_ids: {
                          delegation_id: this.state().resumeCredit?.demande_credit?.delegation_id,
                          agence_id: this.state().resumeCredit?.demande_credit?.agence_id,
                          point_vente_id: this.state().resumeCredit?.demande_credit?.point_vente_id,
                          user_id: this.state().resumeCredit?.demande_credit?.user_id
                      }
                  },

            // Ratios détaillés (existant)
            ratios: this.getResumeRatios(),

            // Évaluation globale (existant)
            evaluation: {
                statut_global: this.getEvaluationGlobale(),
                score_risque: this.getScoreRisque(),
                seuils_respectes: this.getNbSeuilsRespetes() + '/6'
            },

            // Recommandations (existant)
            recommandations: this.getRecommandations(),
            conseils_amelioration: this.getConseilsAmelioration(),
            analyse_risque: this.getAnalyseRisque(),
            decision_recommandee: this.getRecommandationDecision()
        };

        console.log('=== EXPORT ANALYSE COMPLÈTE AVEC INFOS ADMINISTRATIVES CORRIGÉES ===');
        console.log(JSON.stringify(analyseComplete, null, 2));

        this.messageService.add({
            severity: 'success',
            summary: 'Export terminé',
            detail: 'Analyse exportée avec informations administratives complètes'
        });

        this.telechargerAnalyseJSON(analyseComplete);
    }

    /**
     * Test des informations administratives
     */
    testerInfoAdministrative(): void {
        console.log('=== TEST INFORMATIONS ADMINISTRATIVES ===');

        const hasInfo = this.hasInfoAdministrative();
        const isLoading = this.isLoadingInfoAdmin();
        const tracabilite = this.getTracabiliteDetaillee();
        const resume = this.getResumeAdministratif();

        console.log('Données disponibles:', hasInfo);
        console.log('En cours de chargement:', isLoading);
        console.log('Résumé:', resume);
        console.log('Tracabilité détaillée:', tracabilite);

        if (hasInfo) {
            console.log('Informations complètes:', this.state().infoAdministrative);
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Test terminé',
            detail: `Infos admin: ${hasInfo ? 'Disponibles' : 'Non disponibles'}`
        });
    }

    /**
     * Méthode de test incluant les nouvelles données
     */
    testerAnalyseCompleteAvecCautions(): void {
        console.log('=== ANALYSE COMPLÈTE AVEC PERSONNES CAUTION ===');

        // Informations des personnes caution
        console.log('\n1. PERSONNES CAUTION:');
        console.log('Nombre:', this.getNombrePersonnesCaution());
        console.log('Liste:', this.getPersonnesCautionCompact());

        const analyseGarantie = this.getAnalyseGarantiePersonnelle();
        console.log('Analyse garantie:', analyseGarantie);

        // Informations complémentaires demande
        console.log('\n2. INFORMATIONS COMPLÉMENTAIRES DEMANDE:');
        const demande = this.state().resumeCredit?.demande_credit;
        console.log('Délégation ID:', demande?.delegation_id || 'Non renseigné');
        console.log('Agence ID:', demande?.agence_id || 'Non renseigné');
        console.log('Point de vente ID:', demande?.point_vente_id || 'Non renseigné');
        console.log('User ID:', demande?.user_id || 'Non renseigné');

        // Ratios avec nouvelles données
        console.log('\n3. RATIOS AVEC GARANTIES AMÉLIORÉES:');
        console.log('R6 - Couverture (avec bonus cautions):', this.calculerR6Couverture() + '%', '(' + this.getStatutR6() + ')');
        console.log('Valeur garantie totale:', this.formatCurrency(this.getValeurGarantie()));
        console.log('Bonus personnes caution:', `${this.getNombrePersonnesCaution()} personne(s) = +${(this.getNombrePersonnesCaution() * 10).toFixed(0)}%`);

        // Suite de l'analyse existante...
        console.log('\n4. ÉVALUATION GLOBALE:');
        console.log('Statut:', this.getEvaluationGlobale());
        console.log('Score de risque:', this.getScoreRisque() + '/100');

        // Toast notification
        this.messageService.add({
            severity: 'info',
            summary: 'Test terminé',
            detail: 'Analyse avec personnes caution - Consultez la console'
        });
    }

    /**
     * Télécharge l'analyse en fichier JSON
     */
    private telechargerAnalyseJSON(data: any): void {
        const fileName = `analyse_credit_${new Date().toISOString().split('T')[0]}.json`;
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = fileName;
        link.click();

        // Nettoyer
        URL.revokeObjectURL(link.href);
    }

    /**
     * Résumé rapide pour affichage
     */
    getResumePourAffichage(): string {
        const evaluation = this.getEvaluationGlobale();
        const score = this.getScoreRisque();
        const nbSeuils = this.getNbSeuilsRespetes();

        return `Évaluation: ${evaluation} (${score}/100) - ${nbSeuils}/6 seuils respectés`;
    }

    /**
     * Couleur pour le score de risque
     */
    getCouleurScore(score: number): string {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-blue-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    }

    /**
     * Icône selon l'évaluation
     */
    getIconeEvaluation(): string {
        const evaluation = this.getEvaluationGlobale();
        switch (evaluation) {
            case 'EXCELLENT':
                return 'pi pi-check-circle';
            case 'BON':
                return 'pi pi-thumbs-up';
            case 'ACCEPTABLE':
                return 'pi pi-exclamation-triangle';
            case 'RISQUE':
                return 'pi pi-times-circle';
            default:
                return 'pi pi-question-circle';
        }
    }

    /**
     * Récupère les données des personnes caution pour affichage
     */
    getPersonnesCautionData(): TableDataItem[] {
        const personnes = this.state().resumeCredit?.personnes_caution;
        if (!personnes || !Array.isArray(personnes) || personnes.length === 0) {
            return [{ label: 'Aucune personne caution', value: 'Pas de garantie personnelle enregistrée' }];
        }

        const data: TableDataItem[] = [];

        personnes.forEach((personne: Personnecaution, index: number) => {
            data.push(
                { label: `Caution ${index + 1} - Nom`, value: personne.nom || '-' },
                { label: `Caution ${index + 1} - Prénom`, value: personne.prenom || '-' },
                { label: `Caution ${index + 1} - Téléphone`, value: personne.telephone || '-' },
                { label: `Caution ${index + 1} - Activité`, value: personne.activite || '-' },
                { label: `Caution ${index + 1} - Âge`, value: personne.age ? `${personne.age} ans` : '-' },
                { label: `Caution ${index + 1} - Profession`, value: personne.profession || '-' }
            );

            // Ajouter un séparateur si ce n'est pas la dernière personne
            if (index < personnes.length - 1) {
                data.push({ label: '---', value: '---' });
            }
        });

        return data;
    }

    /**
     * Récupère le nombre de personnes caution
     */
    getNombrePersonnesCaution(): number {
        const personnes = this.state().resumeCredit?.personnes_caution;
        return personnes && Array.isArray(personnes) ? personnes.length : 0;
    }

    /**
     * Vérifie si des personnes caution existent
     */
    hasPersonnesCaution(): boolean {
        return this.getNombrePersonnesCaution() > 0;
    }

    /**
     * Récupère la liste des personnes caution pour affichage compact
     */
    getPersonnesCautionCompact(): string[] {
        const personnes = this.state().resumeCredit?.personnes_caution;
        if (!personnes || !Array.isArray(personnes)) return [];

        return personnes.map((personne: Personnecaution) => `${personne.prenom || ''} ${personne.nom || ''} - ${personne.profession || 'N/A'}`);
    }

    /**
     * Analyse du profil de garantie basé sur les personnes caution
     */
    getAnalyseGarantiePersonnelle(): {
        niveau: string;
        score: number;
        description: string;
        recommendations: string[];
    } {
        const nbPersonnes = this.getNombrePersonnesCaution();
        const personnes = this.state().resumeCredit?.personnes_caution || [];

        // Calcul du score basé sur le nombre et la qualité des cautions
        let score = 0;
        let niveau = 'INSUFFISANT';
        let description = '';
        const recommendations: string[] = [];

        if (nbPersonnes === 0) {
            score = 20;
            niveau = 'INSUFFISANT';
            description = 'Aucune personne caution renseignée';
            recommendations.push('Désigner au moins une personne caution solvable');
        } else if (nbPersonnes === 1) {
            score = 60;
            niveau = 'MOYEN';
            description = 'Une seule personne caution';
            recommendations.push('Envisager une seconde personne caution pour renforcer les garanties');
        } else if (nbPersonnes === 2) {
            score = 85;
            niveau = 'BON';
            description = 'Deux personnes caution - profil correct';
            recommendations.push('Vérifier la solvabilité des personnes caution');
        } else {
            score = 95;
            niveau = 'EXCELLENT';
            description = 'Plusieurs personnes caution - très bon profil de garantie';
        }

        // Vérifications complémentaires
        const personnesSansActivite = personnes.filter((p: Personnecaution) => !p.activite || !p.profession);
        if (personnesSansActivite.length > 0) {
            score -= 10;
            recommendations.push(`Compléter les informations d'activité pour ${personnesSansActivite.length} personne(s)`);
        }

        return { niveau, score, description, recommendations };
    }

    // ========================================
    // MÉTHODES UTILITAIRES POUR LES INDICATEURS
    // ========================================

    /**
     * Indicateur de garantie dans les indicateurs clés
     */
    getIndicateurGarantie(): IndicateurCle {
        const analyse = this.getAnalyseGarantiePersonnelle();
        let severity: PrimeSeverity = 'secondary';

        switch (analyse.niveau) {
            case 'EXCELLENT':
                severity = 'success';
                break;
            case 'BON':
                severity = 'info';
                break;
            case 'MOYEN':
                severity = 'warn';
                break;
            case 'INSUFFISANT':
                severity = 'danger';
                break;
        }

        return {
            icon: 'pi pi-users',
            label: 'Garantie personnelle',
            value: `${this.getNombrePersonnesCaution()} personne(s)`,
            severity: severity,
            color: 'teal'
        };
    }

    /**
     * MÉTHODE CORRIGÉE : Données complètes des informations administratives
     */
    getDemandeCreditInfosComplementaires(): TableDataItem[] {
        const infoAdmin = this.state().infoAdministrative;
        const demande = this.state().resumeCredit?.demande_credit;

        if (!infoAdmin || !demande) {
            // Fallback vers les IDs si les données complètes ne sont pas disponibles
            return [
                { label: 'Délégation', value: demande?.delegation_id ? `ID: ${demande.delegation_id}` : 'Non renseignée' },
                { label: 'Agence', value: demande?.agence_id ? `ID: ${demande.agence_id}` : 'Non renseignée' },
                { label: 'Point de vente', value: demande?.point_vente_id ? `ID: ${demande.point_vente_id}` : 'Non renseigné' },
                { label: 'Utilisateur', value: demande?.user_id ? `ID: ${demande.user_id}` : 'Non renseigné' }
            ];
        }

        // CORRECTION : Utilise les vraies propriétés de l'API
        return [
            {
                label: 'Délégation',
                value: infoAdmin.delegationDto.libele!
            },
            {
                label: 'Agence',
                value: infoAdmin.agenceDto.libele! // "libele" au lieu de "nom"
            },
            {
                label: 'Point de vente',
                value: `${infoAdmin.pointVenteDto.libele} (${infoAdmin.pointVenteDto.code})` // "libele" et "code"
            },
            {
                label: 'Utilisateur traitant',
                value: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName} - ${infoAdmin.user.role}` // "firstName", "lastName", "role"
            }
        ];
    }

    /**
     * MÉTHODE CORRIGÉE : Données détaillées pour la traçabilité
     */
    getTracabiliteDetaillee(): {
        delegation: any;
        agence: any;
        pointVente: any;
        user: any;
    } {
        const infoAdmin = this.state().infoAdministrative;
        const demande = this.state().resumeCredit?.demande_credit;

        if (!infoAdmin || !demande) {
            return {
                delegation: {
                    id: demande?.delegation_id || 'N/A',
                    nom: 'Information non disponible',
                    details: 'Chargement...'
                },
                agence: {
                    id: demande?.agence_id || 'N/A',
                    nom: 'Information non disponible',
                    details: 'Chargement...'
                },
                pointVente: {
                    id: demande?.point_vente_id || 'N/A',
                    nom: 'Information non disponible',
                    details: 'Chargement...'
                },
                user: {
                    id: demande?.user_id || 'N/A',
                    nom: 'Information non disponible',
                    details: 'Chargement...'
                }
            };
        }

        // CORRECTION : Utilise les vraies propriétés de l'API
        return {
            delegation: {
                id: infoAdmin.delegationDto.id,
                nom: infoAdmin.delegationDto.libele, // "libele" au lieu de "nom"
                details: `Délégation de ${infoAdmin.delegationDto.libele}`,
                code: `DEL-${infoAdmin.delegationDto.id}` // Généré car pas dans l'API
            },
            agence: {
                id: infoAdmin.agenceDto.id,
                nom: infoAdmin.agenceDto.libele, // "libele" au lieu de "nom"
                details: `Agence ${infoAdmin.agenceDto.libele}`,
                delegation_id: infoAdmin.agenceDto.delegation_id
            },
            pointVente: {
                id: infoAdmin.pointVenteDto.id,
                nom: infoAdmin.pointVenteDto.libele, // "libele" au lieu de "nom"
                code: infoAdmin.pointVenteDto.code,
                details: `Point de vente ${infoAdmin.pointVenteDto.libele} (Code: ${infoAdmin.pointVenteDto.code})`,
                agence_id: infoAdmin.pointVenteDto.agence_id,
                delegation_id: infoAdmin.pointVenteDto.delegation_id
            },
            user: {
                id: infoAdmin.user.userId, // "userId" au lieu de "user_id"
                nom: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName}`, // "firstName" et "lastName"
                email: infoAdmin.user.email,
                details: infoAdmin.user.role || 'Rôle non spécifié', // "role" au lieu de "fonction"
                username: infoAdmin.user.username,
                phone: infoAdmin.user.phone || 'Non renseigné',
                lastLogin: infoAdmin.user.lastLogin || 'Jamais connecté',
                enabled: infoAdmin.user.enabled
            }
        };
    }

    /**
     * Vérifie si les informations administratives sont disponibles
     */
    hasInfoAdministrative(): boolean {
        return !!this.state().infoAdministrative;
    }

    /**
     * Vérifie si les informations administratives sont en cours de chargement
     */
    isLoadingInfoAdmin(): boolean {
        return this.state().loadingAdmin;
    }

    /**
     * MÉTHODE CORRIGÉE : Résumé administratif
     */
    getResumeAdministratif(): string {
        const info = this.state().infoAdministrative;
        if (!info) return 'Informations en cours de chargement...';

        // CORRECTION : Utilise les vraies propriétés
        return `${info.delegationDto.libele} > ${info.agenceDto.libele} > ${info.pointVenteDto.libele} (${info.pointVenteDto.code})`;
    }

    /**
     * Prépare et lance l'impression du bilan de crédit
     */
    imprimerBilan(options: PrintOptions = {}): void {
        if (!this.state().resumeCredit) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Aucune donnée disponible pour l'impression"
            });
            return;
        }

        try {
            const donneesImpression = this.preparerDonneesImpression();

            // Options par défaut
            const optionsImpression: PrintOptions = {
                includeIndicateurs: true,
                includeSignature: false,
                title: "Résumé d'Analyse de Crédit",
                ...options
            };

            this.printService.imprimerBilan(donneesImpression, optionsImpression);

            this.messageService.add({
                severity: 'success',
                summary: 'Impression',
                detail: "Fenêtre d'impression ouverte"
            });
        } catch (error) {
            console.error("Erreur lors de l'impression:", error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible de générer le document d'impression"
            });
        }
    }

    /**
     * Prépare toutes les données nécessaires pour l'impression
     */
    private preparerDonneesImpression(): any {
        const resume = this.state().resumeCredit;
        const infoAdmin = this.state().infoAdministrative;

        return {
            // Informations générales
            dateImpression: new Date().toISOString(),
            montantDemande: this.formatCurrency(this.getMontantCredit()),
            evaluationGlobale: this.getEvaluationGlobale(),
            scoreRisque: this.getScoreRisque(),
            seuilsRespetes: this.getNbSeuilsRespetes(),

            // Ratios détaillés pour les indicateurs
            ratios: [
                {
                    nom: 'R1 - Capacité de remboursement',
                    valeur: this.calculerR1Capacite(),
                    statut: this.getStatutR1(),
                    formule: '(Cash Flow + Autres revenus) / Traite revenus'
                },
                {
                    nom: 'R2 - Ratio de solvabilité',
                    valeur: this.calculerR2Solvabilite(),
                    statut: this.getStatutR2(),
                    formule: 'Capitaux propres / Total Actif'
                },
                {
                    nom: 'R3 - Ratio de liquidité',
                    valeur: this.calculerR3Liquidite(),
                    statut: this.getStatutR3(),
                    formule: '(Créances + Trésorerie) / Dettes court terme'
                },
                {
                    nom: "R4 - Ratio d'endettement",
                    valeur: this.calculerR4Endettement(),
                    statut: this.getStatutR4(),
                    formule: '(Dettes totales + Crédit) / (Total Actif + Crédit)'
                },
                {
                    nom: 'R5 - Ratio de dépendance',
                    valeur: this.calculerR5Dependance(),
                    statut: this.getStatutR5(),
                    formule: 'Autres revenus / Revenus totaux'
                },
                {
                    nom: 'R6 - Ratio de couverture',
                    valeur: this.calculerR6Couverture(),
                    statut: this.getStatutR6(),
                    formule: 'Valeur de la garantie / Crédit'
                }
            ],

            // Informations détaillées
            promoteur: this.getPromoteurData(),
            entreprise: this.getEntrepriseData(),
            bilanEntreprise: this.getBilanEntrepriseData(),
            bilanPersonnel: this.getBilanPersonnelData(),
            exploitationActuelle: this.getExploitationActuelleData(),
            exploitationPrevisionnelle: this.getExploitationPrevisionnelleData(),
            chargesActuelles: this.getChargesData('actuelle'),
            chargesPrevisionnelles: this.getChargesData('previsionnelle'),
            demandeCredit: this.getDemandeCreditData().slice(0, 7), // Exclure les IDs techniques
            infoAdministratives: this.getDemandeCreditInfosComplementaires(),

            // Personnes caution
            personnesCaution: resume?.personnes_caution || [],
            personnesCautionData: this.getPersonnesCautionData(),
            analyseGarantie: this.getAnalyseGarantiePersonnelle(),

            // Analyse et recommandations
            recommandations: this.getRecommandations(),
            conseilsAmelioration: this.getConseilsAmelioration(),
            analyseRisque: this.getAnalyseRisque(),
            decisionRecommandee: this.getRecommandationDecision(),

            // Métadonnées
            utilisateur: this.state().user,
            informationsAdministratives: infoAdmin
                ? {
                      delegation: infoAdmin.delegationDto.libele,
                      agence: infoAdmin.agenceDto.libele,
                      pointVente: `${infoAdmin.pointVenteDto.libele} (${infoAdmin.pointVenteDto.code})`,
                      utilisateurTraitant: `${infoAdmin.user.firstName} ${infoAdmin.user.lastName} - ${infoAdmin.user.role}`
                  }
                : null
        };
    }

    /**
     * Impression simplifiée (sans ratios détaillés)
     */
    imprimerSimple(): void {
        this.imprimerBilan({
            includeIndicateurs: false,
            includeSignature: false
        });
    }

    /**
     * Export PDF via impression (workaround)
     */
    exporterPDF(): void {
        // Note: Cette méthode utilise la fonctionnalité d'impression du navigateur
        // L'utilisateur devra choisir "Enregistrer au format PDF" dans la boîte de dialogue
        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: 'Utilisez l\'option "Enregistrer au format PDF" dans la fenêtre d\'impression'
        });

        this.imprimerBilan({
            includeSignature: false,
            includeIndicateurs: true
        });
    }

    /**
     * Génère le HTML pour la prévisualisation
     */
    private genererHTMLPreview(data: any): string {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Prévisualisation - Résumé d'Analyse de Crédit</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .preview-header { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
                    .preview-actions { text-align: center; margin-bottom: 20px; }
                    .print-btn { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .close-btn { background: #6c757d; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; margin: 0 10px; }
                    .content { border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h2>Prévisualisation du Résumé d'Analyse de Crédit</h2>
                    <p>Vérifiez le contenu avant impression. Cette prévisualisation montre le document tel qu'il sera imprimé.</p>
                </div>
                
                <div class="preview-actions">
                    <button class="print-btn" onclick="window.print()">Imprimer</button>
                    <button class="close-btn" onclick="window.close()">Fermer</button>
                </div>
                
                <div class="content">
                    <h1>RÉSUMÉ D'ANALYSE DE CRÉDIT</h1>
                    <p><strong>Montant demandé:</strong> ${data.montantDemande}</p>
                    <p><strong>Évaluation:</strong> ${data.evaluationGlobale}</p>
                    <p><strong>Score de risque:</strong> ${data.scoreRisque}/100</p>
                    
                    <h2>PROMOTEUR</h2>
                    ${this.genererTableauPreview(data.promoteur)}
                    
                    <h2>ENTREPRISE</h2>
                    ${this.genererTableauPreview(data.entreprise)}
                    
                    <h2>RECOMMANDATIONS</h2>
                    <ul>
                        ${data.recommandations.map((rec: string) => `<li>${rec}</li>`).join('')}
                    </ul>
                    
                    <p style="margin-top: 30px; text-align: center; color: #6c757d; font-size: 12px;">
                        Document généré le ${new Date().toLocaleDateString('fr-FR')}
                    </p>
                </div>
            </body>
            </html>
        `;
    }

    /**
     * Génère un tableau HTML simple pour la prévisualisation
     */
    private genererTableauPreview(data: any[]): string {
        if (!data || data.length === 0) return '<p>Aucune donnée disponible</p>';

        return `
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                ${data
                    .map(
                        (item) => `
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 8px; background: #f8f9fa; font-weight: bold; width: 40%;">${item.label}</td>
                        <td style="border: 1px solid #ddd; padding: 8px;">${item.value}</td>
                    </tr>
                `
                    )
                    .join('')}
            </table>
        `;
    }

    /**
     * Méthode utilitaire pour vérifier si l'impression est possible
     */
    peutImprimer(): boolean {
        return !!(this.state().resumeCredit && !this.state().loading);
    }

    /**
     * Obtient un résumé des données pour l'impression
     */
    getResumeImpression(): string {
        if (!this.peutImprimer()) return 'Aucune donnée disponible';

        const evaluation = this.getEvaluationGlobale();
        const montant = this.formatCurrency(this.getMontantCredit());
        const promoteur = this.state().resumeCredit?.promoteur;

        return `${promoteur?.prenom} ${promoteur?.nom} - ${montant} - ${evaluation}`;
    }

    printMenuModel = [
        {
            label: 'Prévisualiser',
            icon: 'pi pi-eye',
            command: () => this.previsualiserImpression()
        },
        {
            label: 'Imprimer avec signature',
            icon: 'pi pi-file-edit',
            command: () => this.imprimerAvecSignature()
        },
        {
            label: 'Version simplifiée',
            icon: 'pi pi-file',
            command: () => this.imprimerSimple()
        },
        {
            separator: true
        },
        {
            label: 'Exporter en PDF',
            icon: 'pi pi-file-pdf',
            command: () => this.exporterPDF()
        }
    ];

    /**
     * Prépare et lance l'impression du résumé de crédit
     */
    imprimerResumeCredit(options: ResumePrintOptions = {}): void {
        if (!this.state().resumeCredit) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Aucune donnée disponible pour l'impression"
            });
            return;
        }

        try {
            const donneesImpression = this.preparerDonneesImpressionResume();

            // Options par défaut
            const optionsImpression: ResumePrintOptions = {
                includeEvaluation: true,
                includeRatios: this.state().user?.role === 'MANAGER' || this.state().user?.role === 'DA',
                includeRecommandations: true,
                includeSignature: false,
                title: "Résumé d'Analyse de Crédit",
                ...options
            };

            this.resumePrintService.imprimerResumeCredit(donneesImpression, optionsImpression);

            this.messageService.add({
                severity: 'success',
                summary: 'Impression',
                detail: "Fenêtre d'impression ouverte"
            });
        } catch (error) {
            console.error("Erreur lors de l'impression:", error);
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Impossible de générer le document d'impression"
            });
        }
    }

    /**
     * Prépare toutes les données nécessaires pour l'impression du résumé
     */
    private preparerDonneesImpressionResume(): any {
        const resume = this.state().resumeCredit;
        const infoAdmin = this.state().infoAdministrative;

        return {
            // Informations générales
            dateImpression: new Date().toISOString(),
            montantDemande: this.getMontantCredit(),
            evaluation: this.getEvaluationGlobale(),
            scoreRisque: this.getScoreRisque(),
            seuilsRespetes: this.getNbSeuilsRespetes(),

            // Ratios détaillés (seulement si rôle approprié)
            ratios:
                this.state().user?.role === 'MANAGER' || this.state().user?.role === 'DA'
                    ? {
                          R1: {
                              nom: 'R1 - Capacité de remboursement',
                              valeur: this.calculerR1Capacite(),
                              statut: this.getStatutR1(),
                              formule: '(Cash Flow + Autres revenus) / Traite revenus'
                          },
                          R2: {
                              nom: 'R2 - Ratio de solvabilité',
                              valeur: this.calculerR2Solvabilite(),
                              statut: this.getStatutR2(),
                              formule: 'Capitaux propres / Total Actif'
                          },
                          R3: {
                              nom: 'R3 - Ratio de liquidité',
                              valeur: this.calculerR3Liquidite(),
                              statut: this.getStatutR3(),
                              formule: '(Créances + Trésorerie) / Dettes court terme'
                          },
                          R4: {
                              nom: "R4 - Ratio d'endettement",
                              valeur: this.calculerR4Endettement(),
                              statut: this.getStatutR4(),
                              formule: '(Dettes totales + Crédit) / (Total Actif + Crédit)'
                          },
                          R5: {
                              nom: 'R5 - Ratio de dépendance',
                              valeur: this.calculerR5Dependance(),
                              statut: this.getStatutR5(),
                              formule: 'Autres revenus / Revenus totaux'
                          },
                          R6: {
                              nom: 'R6 - Ratio de couverture',
                              valeur: this.calculerR6Couverture(),
                              statut: this.getStatutR6(),
                              formule: 'Valeur de la garantie / Crédit'
                          }
                      }
                    : null,

            // Informations détaillées
            promoteur: this.getPromoteurData(),
            entreprise: this.getEntrepriseData(),
            bilanEntreprise: this.getBilanEntrepriseData(),
            bilanPersonnel: this.getBilanPersonnelData(),
            exploitationActuelle: this.getExploitationActuelleData(),
            exploitationPrevisionnelle: this.getExploitationPrevisionnelleData(),
            chargesActuelles: this.getChargesData('actuelle'),
            chargesPrevisionnelles: this.getChargesData('previsionnelle'),
            demandeCredit: this.getDemandeCreditData().slice(0, 7), // Exclure les IDs techniques
            infoAdministratives: this.getDemandeCreditInfosComplementaires(),

            // Personnes caution
            personnesCaution: resume?.personnes_caution || [],
            personnesCautionData: this.getPersonnesCautionData(),
            analyseGarantie: this.getAnalyseGarantiePersonnelle(),

            // Analyse et recommandations
            recommandations: this.getRecommandations(),
            conseilsAmelioration: this.getConseilsAmelioration(),
            analyseRisque: this.getAnalyseRisque(),
            decisionRecommandee: this.getRecommandationDecision(),

            // Métadonnées
            utilisateur: this.state().user,
            informationsAdministratives: infoAdmin
                ? {
                      delegation: infoAdmin.delegationDto?.libele,
                      agence: infoAdmin.agenceDto?.libele,
                      pointVente: `${infoAdmin.pointVenteDto?.libele} (${infoAdmin.pointVenteDto?.code})`,
                      utilisateurTraitant: `${infoAdmin.user?.firstName} ${infoAdmin.user?.lastName} - ${infoAdmin.user?.role}`
                  }
                : null
        };
    }

    /**
     * Impression avec signature (pour validation officielle)
     */
    imprimerAvecSignature(): void {
        this.imprimerResumeCredit({
            includeSignature: true,
            includeEvaluation: true,
            includeRatios: true,
            includeRecommandations: true
        });
    }

    /**
     * Impression simplifiée (sans ratios détaillés)
     */
    imprimerResumeSimple(): void {
        this.imprimerResumeCredit({
            includeEvaluation: true,
            includeRatios: false,
            includeRecommandations: true,
            includeSignature: false
        });
    }

    /**
     * Impression des ratios seulement (pour managers/DA)
     */
    imprimerRatiosDetailles(): void {
        if (this.state().user?.role !== 'MANAGER' && this.state().user?.role !== 'DA') {
            this.messageService.add({
                severity: 'warn',
                summary: 'Accès restreint',
                detail: 'Seuls les managers et DA peuvent imprimer les ratios détaillés'
            });
            return;
        }

        this.imprimerResumeCredit({
            includeEvaluation: true,
            includeRatios: true,
            includeRecommandations: false,
            includeSignature: false
        });
    }

    /**
     * Export PDF via impression (workaround)
     */
    exporterResumePDF(): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Export PDF',
            detail: 'Utilisez l\'option "Enregistrer au format PDF" dans la fenêtre d\'impression'
        });

        // Délai pour que l'utilisateur voie le message
        setTimeout(() => {
            this.imprimerResumeCredit({
                includeSignature: false,
                includeEvaluation: true,
                includeRatios: true,
                includeRecommandations: true
            });
        }, 1000);
    }

    /**
     * Prévisualisation avant impression
     */
    previsualiserImpression(): void {
        if (!this.state().resumeCredit) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Aucune donnée disponible pour la prévisualisation'
            });
            return;
        }

        // Pour la prévisualisation, on ouvre simplement l'impression
        // Le navigateur proposera automatiquement l'aperçu
        this.imprimerResumeCredit();
    }

    /**
     * Vérifie si l'impression est possible
     */
    peutImprimerResume(): boolean {
        return !!(this.state().resumeCredit && !this.state().loading);
    }

    /**
     * Obtient un résumé des données pour l'impression
     */
    getResumeImpressionPourAffichage(): string {
        if (!this.peutImprimerResume()) return 'Aucune donnée disponible';

        const evaluation = this.getEvaluationGlobale();
        const montant = this.formatCurrency(this.getMontantCredit());
        const promoteur = this.state().resumeCredit?.promoteur;

        return `${promoteur?.prenom} ${promoteur?.nom} - ${montant} - ${evaluation}`;
    }

    /**
     * Obtient le statut d'impression avec détails
     */
    getStatutImpression(): {
        disponible: boolean;
        message: string;
        details?: any;
    } {
        if (!this.state().resumeCredit) {
            return {
                disponible: false,
                message: 'Aucune donnée de résumé disponible'
            };
        }

        if (this.state().loading) {
            return {
                disponible: false,
                message: 'Chargement en cours...'
            };
        }

        const resume = this.state().resumeCredit;
        const evaluation = this.getEvaluationGlobale();
        const scoreRisque = this.getScoreRisque();

        return {
            disponible: true,
            message: 'Prêt pour impression',
            details: {
                promoteur: `${resume?.promoteur?.prenom} ${resume?.promoteur?.nom}`,
                entreprise: resume?.entreprise?.nom,
                montantDemande: this.formatCurrency(this.getMontantCredit()),
                evaluation: evaluation,
                scoreRisque: `${scoreRisque}/100`,
                nbPersonnesCaution: this.getNombrePersonnesCaution(),
                hasInfoAdmin: this.hasInfoAdministrative(),
                canViewRatios: this.state().user?.role === 'MANAGER' || this.state().user?.role === 'DA'
            }
        };
    }

    /**
     * Impression avec options personnalisées via dialog
     */
    ouvrirDialogOptionsImpression(): void {
        if (!this.peutImprimerResume()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: "Aucune donnée disponible pour l'impression"
            });
            return;
        }

        // Vous pouvez implémenter un dialog ici pour permettre à l'utilisateur
        // de choisir les options d'impression
        this.messageService.add({
            severity: 'info',
            summary: "Options d'impression",
            detail: "Fonctionnalité à développer: dialog d'options d'impression"
        });
    }

    /**
     * Validation des données avant impression
     */
    private validerDonneesAvantImpression(): boolean {
        if (!this.state().resumeCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Données manquantes',
                detail: 'Aucun résumé de crédit disponible'
            });
            return false;
        }

        if (!this.state().resumeCredit?.promoteur) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Données incomplètes',
                detail: 'Informations du promoteur manquantes'
            });
            return false;
        }

        if (!this.getMontantCredit() || this.getMontantCredit() === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Données incomplètes',
                detail: 'Montant du crédit non défini'
            });
            return false;
        }

        return true;
    }

    /**
     * Impression avec validation complète
     */
    imprimerAvecValidation(options: ResumePrintOptions = {}): void {
        if (!this.validerDonneesAvantImpression()) {
            return;
        }

        this.imprimerResumeCredit(options);
    }

    /**
     * Obtient les options d'impression disponibles selon le rôle
     */
    getOptionsImpressionDisponibles(): any[] {
        const baseOptions = [
            {
                label: 'Impression standard',
                icon: 'pi pi-print',
                command: () => this.imprimerResumeCredit()
            },
            {
                label: 'Version simplifiée',
                icon: 'pi pi-file',
                command: () => this.imprimerResumeSimple()
            },
            {
                separator: true
            },
            {
                label: 'Exporter en PDF',
                icon: 'pi pi-file-pdf',
                command: () => this.exporterResumePDF()
            }
        ];

        // Ajouter les options spécifiques aux managers/DA
        if (this.state().user?.role === 'MANAGER' || this.state().user?.role === 'DA') {
            baseOptions.splice(-2, 0, {
                label: 'Avec signature',
                icon: 'pi pi-file-edit',
                command: () => this.imprimerAvecSignature()
            });

            baseOptions.splice(-2, 0, {
                label: 'Ratios détaillés',
                icon: 'pi pi-chart-bar',
                command: () => this.imprimerRatiosDetailles()
            });
        }

        return baseOptions;
    }

    // ========================================
    // NOUVELLES MÉTHODES POUR VISUALISATION DURÉE
    // ========================================

    /**
     * Retourne la durée en mois du crédit
     */
    getDureeMois(): number {
        return this.state().resumeCredit?.demande_credit?.duree_mois || 0;
    }

    /**
     * Retourne la durée formatée en années et mois
     */
    getDureeEnAnneesResume(): string {
        const mois = this.getDureeMois();
        if (mois === 0) return '0 mois';
        if (mois < 12) return `${mois} mois`;

        const annees = Math.floor(mois / 12);
        const moisRestants = mois % 12;

        if (moisRestants === 0) {
            return annees === 1 ? '1 an' : `${annees} ans`;
        }
        return `${annees} an${annees > 1 ? 's' : ''} et ${moisRestants} mois`;
    }

    /**
     * Retourne la sévérité du tag selon la durée
     */
    getDureeSeverityResume(): PrimeSeverity {
        const mois = this.getDureeMois();
        if (mois <= 12) return 'success';
        if (mois <= 36) return 'info';
        if (mois <= 60) return 'warn';
        return 'danger';
    }

    /**
     * Retourne la liste des années du crédit avec le nombre de mois par année
     */
    getAnneesCredit(): { numero: number; mois: number }[] {
        const totalMois = this.getDureeMois();
        if (totalMois === 0) return [];

        const annees: { numero: number; mois: number }[] = [];
        let moisRestants = totalMois;
        let numeroAnnee = 1;

        while (moisRestants > 0) {
            const moisCetteAnnee = Math.min(12, moisRestants);
            annees.push({
                numero: numeroAnnee,
                mois: moisCetteAnnee
            });
            moisRestants -= moisCetteAnnee;
            numeroAnnee++;
        }

        return annees;
    }

    /**
     * Retourne les mois d'une année donnée avec leur état
     */
    getMoisAnnee(numeroAnnee: number): { index: number; nom: string; actif: boolean; numeroGlobal: number }[] {
        const nomsDesMois = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
        const totalMois = this.getDureeMois();
        const moisDebutAnnee = (numeroAnnee - 1) * 12;

        return nomsDesMois.map((nom, index) => {
            const numeroGlobal = moisDebutAnnee + index + 1;
            return {
                index: index,
                nom: nom,
                actif: numeroGlobal <= totalMois,
                numeroGlobal: numeroGlobal
            };
        });
    }

    /**
     * Retourne la classe CSS pour la couleur de l'année
     */
    getAnneeColorClass(numeroAnnee: number): string {
        if (numeroAnnee === 1) return 'text-green-700';
        if (numeroAnnee === 2) return 'text-blue-700';
        return 'text-orange-700';
    }

    /**
     * Retourne les segments de la barre de progression
     */
    getProgressSegments(): { annee: number; mois: number; pourcentage: number; couleur: string }[] {
        const annees = this.getAnneesCredit();
        const totalMois = this.getDureeMois();

        if (totalMois === 0) return [];

        return annees.map((annee) => ({
            annee: annee.numero,
            mois: annee.mois,
            pourcentage: (annee.mois / totalMois) * 100,
            couleur: annee.numero === 1 ? 'green' : annee.numero === 2 ? 'blue' : 'orange'
        }));
    }

    /**
     * Retourne les données pour le tableau de calcul des mensualités
     */
    getCalculMensualiteData(): TableDataItem[] {
        const montant = this.getMontantCredit();
        const duree = this.getDureeMois();
        const mensualite = this.calculerMensualite();
        const totalRemboursement = mensualite * duree;

        return [
            { label: 'Montant emprunté', value: this.formatCurrency(montant) },
            { label: 'Durée du crédit', value: `${duree} mois (${this.getDureeEnAnneesResume()})` },
            { label: 'Mensualité', value: this.formatCurrency(mensualite) },
            { label: 'Nombre de paiements', value: `${duree} mensualités` },
            { label: 'Total à rembourser', value: this.formatCurrency(totalRemboursement), isTotal: true }
        ];
    }
}
