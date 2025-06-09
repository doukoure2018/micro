import { IResponse } from '@/interface/response';
import { ResumeCredit } from '@/interface/resumeCredit.model';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
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
    imports: [CommonModule, CardModule, PanelModule, TableModule, TagModule, ButtonModule, ProgressSpinnerModule, ToastModule, BadgeModule, DividerModule, SkeletonModule, ProgressBarModule],
    templateUrl: './resume-credit.component.html',
    styles: [
        `
            .recommendation-list {
                max-height: 300px;
                overflow-y: auto;
            }

            .risk-analysis .p-progressbar {
                border-radius: 10px;
            }

            .progress-excellent .p-progressbar-value {
                background: linear-gradient(90deg, #27ae60, #2ecc71);
            }

            .progress-bon .p-progressbar-value {
                background: linear-gradient(90deg, #3498db, #5dade2);
            }

            .progress-acceptable .p-progressbar-value {
                background: linear-gradient(90deg, #f39c12, #e67e22);
            }

            .progress-risque .p-progressbar-value {
                background: linear-gradient(90deg, #e74c3c, #ec7063);
            }

            .conseil-item {
                transition: all 0.3s ease;
            }

            .conseil-item:hover {
                transform: translateX(5px);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            .decision-recommendation {
                border-left: 4px solid #8e44ad;
            }

            .bg-accorder-50 {
                background-color: rgba(39, 174, 96, 0.1);
                border-left-color: #27ae60;
            }

            .bg-accorder-avec-conditions-50 {
                background-color: rgba(52, 152, 219, 0.1);
                border-left-color: #3498db;
            }

            .bg-etude-approfondie-50 {
                background-color: rgba(243, 156, 18, 0.1);
                border-left-color: #f39c12;
            }

            .bg-refuser-50 {
                background-color: rgba(231, 76, 60, 0.1);
                border-left-color: #e74c3c;
            }

            .indicator-card-simple {
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 12px;
                padding: 1.5rem;
                height: 100%;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                position: relative;
            }

            .indicator-card-simple:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }

            .indicator-header h5 {
                font-size: 1rem;
                line-height: 1.2;
            }

            .indicator-header small {
                font-size: 0.75rem;
                font-style: italic;
            }

            .indicator-value {
                color: #2c3e50;
            }

            .indicator-details {
                border-top: 1px solid #e9ecef;
                padding-top: 1rem;
                margin-top: 1rem;
            }

            /* Styles pour les séparateurs */
            .separator-container {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 1rem 0;
            }

            .indicator-separator {
                width: 80%;
                height: 2px;
                background: linear-gradient(90deg, transparent 0%, #3498db 20%, #2ecc71 40%, #f39c12 60%, #e74c3c 80%, transparent 100%);
                border-radius: 2px;
                position: relative;
                opacity: 0.7;
            }

            .indicator-separator::before {
                content: '';
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 12px;
                height: 12px;
                background: #fff;
                border: 2px solid #3498db;
                border-radius: 50%;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }

            /* Alternative: Séparateur avec texte */
            .separator-with-text {
                position: relative;
                text-align: center;
                margin: 1.5rem 0;
            }

            .separator-with-text::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: linear-gradient(90deg, transparent, #dee2e6, transparent);
            }

            .separator-with-text span {
                background: white;
                padding: 0 1rem;
                color: #6c757d;
                font-size: 0.8rem;
                font-weight: 500;
            }

            /* Séparateurs responsives */
            @media (max-width: 992px) {
                .separator-container {
                    margin: 0.5rem 0;
                }

                .indicator-separator {
                    width: 60%;
                    height: 1px;
                }

                .indicator-separator::before {
                    width: 8px;
                    height: 8px;
                }
            }

            @media (max-width: 768px) {
                .indicator-card-simple {
                    padding: 1rem;
                    margin-bottom: 1.5rem;
                }

                .indicator-value {
                    font-size: 2rem !important;
                }

                .indicator-header h5 {
                    font-size: 0.9rem;
                }

                .indicator-header small {
                    font-size: 0.7rem;
                }

                /* Masquer les séparateurs sur mobile */
                .separator-container {
                    display: none;
                }
            }

            /* Variante: Séparateur en pointillés */
            .dotted-separator {
                width: 100%;
                height: 1px;
                background: repeating-linear-gradient(90deg, #3498db 0px, #3498db 4px, transparent 4px, transparent 8px);
            }

            /* Variante: Séparateur avec ombre */
            .shadow-separator {
                width: 80%;
                height: 1px;
                background: #e9ecef;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                border-radius: 1px;
            }
            .seuils-card-large {
                max-width: 1200px;
                margin: 0 auto;
            }

            .seuils-content {
                padding: 2rem;
            }

            .seuils-section,
            .evaluation-section {
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .seuils-list {
                flex: 1;
                border-left: 4px solid #27ae60;
            }

            .seuils-list ul li {
                transition: all 0.3s ease;
            }

            .seuils-list ul li:hover {
                transform: translateX(5px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            .evaluation-box {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-height: 350px;
            }

            .evaluation-main {
                text-align: center;
            }

            .progress-section {
                margin: 1.5rem 0;
            }

            .progress-excellent .p-progressbar-value {
                background: linear-gradient(90deg, #27ae60, #2ecc71);
            }

            .progress-bon .p-progressbar-value {
                background: linear-gradient(90deg, #3498db, #5dade2);
            }

            .progress-acceptable .p-progressbar-value {
                background: linear-gradient(90deg, #f39c12, #e67e22);
            }

            .progress-risque .p-progressbar-value {
                background: linear-gradient(90deg, #e74c3c, #ec7063);
            }

            .status-indicator {
                margin-top: 1rem;
            }

            .recapitulatif-centre {
                border: 2px dashed #dee2e6;
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            }

            .metric-item {
                text-align: center;
                padding: 0.5rem;
            }

            .metric-separator {
                font-size: 1.5rem;
                color: #dee2e6;
                font-weight: bold;
            }

            /* Responsive */
            @media (max-width: 992px) {
                .seuils-content {
                    padding: 1.5rem;
                }

                .evaluation-box {
                    min-height: 300px;
                    margin-top: 2rem;
                }

                .text-5xl {
                    font-size: 3rem !important;
                }
            }

            @media (max-width: 768px) {
                .seuils-content {
                    padding: 1rem;
                }

                .text-2xl {
                    font-size: 1.5rem !important;
                }

                .text-5xl {
                    font-size: 2.5rem !important;
                }

                .evaluation-box {
                    min-height: 250px;
                    padding: 1rem !important;
                }

                .metric-item {
                    margin: 0.5rem 0;
                }

                .metric-separator {
                    display: none;
                }

                .flex-wrap .metric-item {
                    flex: 1;
                    min-width: 80px;
                }
            }

            /* Animation pour les éléments */
            .seuils-list ul li,
            .evaluation-box,
            .metric-item {
                animation: fadeInUp 0.6s ease forwards;
            }

            .seuils-list ul li:nth-child(1) {
                animation-delay: 0.1s;
            }
            .seuils-list ul li:nth-child(2) {
                animation-delay: 0.2s;
            }
            .seuils-list ul li:nth-child(3) {
                animation-delay: 0.3s;
            }
            .seuils-list ul li:nth-child(4) {
                animation-delay: 0.4s;
            }
            .seuils-list ul li:nth-child(5) {
                animation-delay: 0.5s;
            }
            .seuils-list ul li:nth-child(6) {
                animation-delay: 0.6s;
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `
    ],
    providers: [MessageService]
})
export class ResumeCreditComponent {
    state = signal<{
        resumeCredit?: ResumeCredit;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        searching: boolean;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        searching: false
    });

    // Injection des services
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private analyseCreditService = inject(UserService);

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

        // Appel de l'API pour récupérer le résumé
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
                            loading: false,
                            message: 'Résumé chargé avec succès'
                        }));

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
        if (this.userId) {
            this.router.navigate([`/dashboards/credit/${this.userId}`]);
        } else {
            this.router.navigate(['/dashboards/credit']);
        }
    }

    modifierDemande(): void {
        if (this.demandeId && this.userId) {
            this.router.navigate([`/dashboards/credit/${this.userId}/edit/${this.demandeId}`]);
        }
    }

    imprimerResume(): void {
        window.print();
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

    getDemandeCreditData(): TableDataItem[] {
        const demande = this.state().resumeCredit?.demande_credit;
        if (!demande) return [];

        return [
            { label: 'Date demande', value: this.formatDateForDisplay(demande.date_demande) || '-' },
            { label: 'Montant demandé', value: this.formatCurrency(demande.montant_demande || 0) },
            { label: 'Durée', value: `${demande.duree_mois || 0} mois` },
            { label: 'Mensualité estimée', value: this.formatCurrency(this.calculerMensualite()) },
            {
                label: 'Ratio crédit/Revenus totaux',
                value: this.formatPercent(this.calculerRatioCreditCA()),
                severity: this.getRatioCreditCASeverity(),
                isRatio: true
            },
            { label: 'Statut', value: demande.statut || '-', isStatus: true }
        ];
    }

    // ========================================
    // INDICATEURS CLÉS MODIFIÉS
    // ========================================

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
     * Calcule R1 - Capacité de remboursement
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
        // Traite = mensualité de remboursement
        return this.calculerMensualite();
    }

    getStatutR1(): string {
        const ratio = parseFloat(this.calculerR1Capacite());
        if (ratio >= 150) return 'EXCELLENT';
        if (ratio >= 120) return 'BON';
        if (ratio >= 100) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR1(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR1Capacite());
        if (ratio >= 150) return 'success';
        if (ratio >= 120) return 'info';
        if (ratio >= 100) return 'warn';
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
        if (ratio >= 25) return 'EXCELLENT';
        if (ratio >= 15) return 'BON';
        if (ratio >= 10) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR2(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR2Solvabilite());
        if (ratio >= 25) return 'success';
        if (ratio >= 15) return 'info';
        if (ratio >= 10) return 'warn';
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
        if (ratio >= 100) return 'EXCELLENT';
        if (ratio >= 80) return 'BON';
        if (ratio >= 60) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR3(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR3Liquidite());
        if (ratio >= 100) return 'success';
        if (ratio >= 80) return 'info';
        if (ratio >= 60) return 'warn';
        return 'danger';
    }

    // R4 - RATIO D'ENDETTEMENT
    // Formule: (Dettes totales + Crédit) / (Total Actif + Crédit)

    /**
     * Calcule R4 - Ratio d'endettement
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
        if (ratio <= 70) return 'EXCELLENT';
        if (ratio <= 80) return 'BON';
        if (ratio <= 90) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR4(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR4Endettement());
        if (ratio <= 70) return 'success';
        if (ratio <= 80) return 'info';
        if (ratio <= 90) return 'warn';
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
        if (ratio <= 30) return 'EXCELLENT';
        if (ratio <= 40) return 'BON';
        if (ratio <= 50) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR5(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR5Dependance());
        if (ratio <= 30) return 'success';
        if (ratio <= 40) return 'info';
        if (ratio <= 50) return 'warn';
        return 'danger';
    }

    // R6 - RATIO DE COUVERTURE DE LA GARANTIE
    // Formule: Valeur de la garantie / Crédit

    /**
     * Calcule R6 - Ratio de couverture de la garantie
     */
    calculerR6Couverture(): string {
        const valeurGarantie = this.getValeurGarantie();
        const montantCredit = this.getMontantCredit();

        if (montantCredit === 0) return '0.0';

        const ratio = (valeurGarantie / montantCredit) * 100;
        return ratio.toFixed(1);
    }

    getValeurGarantie(): number {
        const resumeCredit = this.state().resumeCredit;

        // Estimation de la garantie basée sur le patrimoine personnel + une partie de l'actif
        const patrimoinePersonnel = this.calculerPatrimoinePersonnel();
        const totalActif = this.calculerTotalActif();

        // Garantie = patrimoine personnel + 50% de l'actif professionnel
        return patrimoinePersonnel + totalActif * 0.5;
    }

    getMontantCredit(): number {
        const resumeCredit = this.state().resumeCredit;
        return resumeCredit?.demande_credit?.montant_demande || 0;
    }

    getStatutR6(): string {
        const ratio = parseFloat(this.calculerR6Couverture());
        if (ratio >= 120) return 'EXCELLENT';
        if (ratio >= 100) return 'BON';
        if (ratio >= 80) return 'ACCEPTABLE';
        return 'RISQUE';
    }

    getSeveriteR6(): PrimeSeverity {
        const ratio = parseFloat(this.calculerR6Couverture());
        if (ratio >= 120) return 'success';
        if (ratio >= 100) return 'info';
        if (ratio >= 80) return 'warn';
        return 'danger';
    }

    // ========================================
    // MÉTHODES D'ÉVALUATION GLOBALE
    // ========================================

    /**
     * Évaluation globale basée sur tous les ratios
     */
    getEvaluationGlobale(): string {
        const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];

        const nbExcellents = statuts.filter((s) => s === 'EXCELLENT').length;
        const nbBons = statuts.filter((s) => s === 'BON').length;
        const nbAcceptables = statuts.filter((s) => s === 'ACCEPTABLE').length;

        if (nbExcellents >= 4) return 'EXCELLENT';
        if (nbExcellents + nbBons >= 4) return 'BON';
        if (nbExcellents + nbBons + nbAcceptables >= 4) return 'ACCEPTABLE';
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
     * Nombre de seuils respectés
     */
    getNbSeuilsRespetes(): number {
        const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];

        return statuts.filter((s) => s === 'EXCELLENT' || s === 'BON').length;
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
        if (r1 < 150) {
            recommendations.push('• Améliorer la capacité de remboursement (Cash Flow insuffisant)');
        }

        // Analyse R2 - Solvabilité
        const r2 = parseFloat(this.calculerR2Solvabilite());
        if (r2 < 25) {
            recommendations.push("• Renforcer les capitaux propres de l'entreprise");
        }

        // Analyse R3 - Liquidité
        const r3 = parseFloat(this.calculerR3Liquidite());
        if (r3 < 100) {
            recommendations.push('• Améliorer la gestion de trésorerie et créances');
        }

        // Analyse R4 - Endettement
        const r4 = parseFloat(this.calculerR4Endettement());
        if (r4 > 70) {
            recommendations.push("• Réduire le niveau d'endettement global");
        }

        // Analyse R5 - Dépendance
        const r5 = parseFloat(this.calculerR5Dependance());
        if (r5 > 50) {
            recommendations.push('• Diversifier les sources de revenus (trop de dépendance aux autres revenus)');
        }

        // Analyse R6 - Couverture
        const r6 = parseFloat(this.calculerR6Couverture());
        if (r6 < 120) {
            recommendations.push('• Renforcer les garanties ou réduire le montant demandé');
        }

        // Si tous les ratios sont bons
        if (recommendations.length === 0) {
            recommendations.push('✅ Tous les indicateurs sont dans les normes acceptables');
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
        if (parseFloat(this.calculerR1Capacite()) < 150) {
            facteurs.push('Capacité de remboursement insuffisante');
        }
        if (parseFloat(this.calculerR5Dependance()) > 50) {
            facteurs.push('Forte dépendance aux autres revenus');
        }
        if (parseFloat(this.calculerR4Endettement()) > 70) {
            facteurs.push("Niveau d'endettement élevé");
        }
        if (parseFloat(this.calculerR3Liquidite()) < 100) {
            facteurs.push('Liquidité insuffisante');
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
        const statuts = [this.getStatutR1(), this.getStatutR2(), this.getStatutR3(), this.getStatutR4(), this.getStatutR5(), this.getStatutR6()];

        let score = 0;
        statuts.forEach((statut) => {
            switch (statut) {
                case 'EXCELLENT':
                    score += 100;
                    break;
                case 'BON':
                    score += 75;
                    break;
                case 'ACCEPTABLE':
                    score += 50;
                    break;
                case 'RISQUE':
                    score += 25;
                    break;
            }
        });

        return Math.round(score / statuts.length);
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
        if (r1 < 150) {
            conseils.push('📈 Augmenter les revenus ou optimiser les charges pour améliorer le cash flow');
        }

        if (r2 < 25) {
            conseils.push('💰 Envisager un apport en capital ou réduire les distributions');
        }

        if (r3 < 100) {
            conseils.push('💧 Accélérer le recouvrement des créances et optimiser la trésorerie');
        }

        if (r4 > 70) {
            conseils.push('📉 Planifier un désendettement progressif avant la nouvelle demande');
        }

        if (r5 > 50) {
            conseils.push("🎯 Développer le chiffre d'affaires principal pour réduire la dépendance");
        }

        if (r6 < 120) {
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
        const score = this.getScoreRisque();
        const nbSeuilsRespetes = this.getNbSeuilsRespetes();

        if (evaluation === 'EXCELLENT' && nbSeuilsRespetes >= 5) {
            return {
                decision: 'ACCORDER',
                justification: 'Profil de risque excellent, tous les indicateurs sont favorables'
            };
        }

        if (evaluation === 'BON' && nbSeuilsRespetes >= 4) {
            return {
                decision: 'ACCORDER_AVEC_CONDITIONS',
                conditions: ['Suivi trimestriel des ratios financiers', 'Maintien des garanties pendant toute la durée'],
                justification: "Profil de risque acceptable avec quelques points d'attention"
            };
        }

        if (evaluation === 'ACCEPTABLE' && nbSeuilsRespetes >= 3) {
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
        console.log('\n1. RATIOS CALCULÉS:');
        console.log('R1 - Capacité:', this.calculerR1Capacite() + '%', '(' + this.getStatutR1() + ')');
        console.log('R2 - Solvabilité:', this.calculerR2Solvabilite() + '%', '(' + this.getStatutR2() + ')');
        console.log('R3 - Liquidité:', this.calculerR3Liquidite() + '%', '(' + this.getStatutR3() + ')');
        console.log('R4 - Endettement:', this.calculerR4Endettement() + '%', '(' + this.getStatutR4() + ')');
        console.log('R5 - Dépendance:', this.calculerR5Dependance() + '%', '(' + this.getStatutR5() + ')');
        console.log('R6 - Couverture:', this.calculerR6Couverture() + '%', '(' + this.getStatutR6() + ')');

        // Évaluation globale
        console.log('\n2. ÉVALUATION GLOBALE:');
        console.log('Statut:', this.getEvaluationGlobale());
        console.log('Score de risque:', this.getScoreRisque() + '/100');
        console.log('Seuils respectés:', this.getNbSeuilsRespetes() + '/6');

        // Recommandations
        console.log('\n3. RECOMMANDATIONS:');
        this.getRecommandations().forEach((rec, index) => {
            console.log(`${index + 1}. ${rec}`);
        });

        // Analyse de risque
        console.log('\n4. ANALYSE DE RISQUE:');
        const analyseRisque = this.getAnalyseRisque();
        console.log('Niveau:', analyseRisque.niveau);
        console.log('Facteurs de risque:', analyseRisque.facteurs);

        // Décision recommandée
        console.log('\n5. DÉCISION RECOMMANDÉE:');
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
     * Export de l'analyse complète
     */
    exporterAnalyseComplete(): void {
        const analyseComplete = {
            // Informations générales
            date_analyse: new Date().toISOString(),
            montant_demande: this.formatCurrency(this.getMontantCredit()),

            // Ratios détaillés
            ratios: {
                R1_capacite: {
                    valeur: this.calculerR1Capacite() + '%',
                    statut: this.getStatutR1(),
                    formule: '(Cash Flow + Autres revenus) / Traite revenus',
                    details: {
                        cash_flow: this.formatCurrency(this.getCashFlow()),
                        autres_revenus: this.formatCurrency(this.getAutresRevenus()),
                        traite_revenus: this.formatCurrency(this.getTraiteRevenus())
                    }
                },
                R2_solvabilite: {
                    valeur: this.calculerR2Solvabilite() + '%',
                    statut: this.getStatutR2(),
                    formule: 'Capitaux propres / Total Actif',
                    details: {
                        capitaux_propres: this.formatCurrency(this.getCapitauxPropres()),
                        total_actif: this.formatCurrency(this.getTotalActif())
                    }
                },
                R3_liquidite: {
                    valeur: this.calculerR3Liquidite() + '%',
                    statut: this.getStatutR3(),
                    formule: '(Créances + Trésorerie) / Dettes court terme',
                    details: {
                        creances_tresorerie: this.formatCurrency(this.getCreancesEtTresorerie()),
                        dettes_court_terme: this.formatCurrency(this.getDettesCourtTerme())
                    }
                },
                R4_endettement: {
                    valeur: this.calculerR4Endettement() + '%',
                    statut: this.getStatutR4(),
                    formule: '(Dettes totales + Crédit) / (Total Actif + Crédit)',
                    details: {
                        dettes_avec_credit: this.formatCurrency(this.getDettesTotalesAvecCredit()),
                        actif_avec_credit: this.formatCurrency(this.getTotalActifAvecCredit())
                    }
                },
                R5_dependance: {
                    valeur: this.calculerR5Dependance() + '%',
                    statut: this.getStatutR5(),
                    formule: 'Autres revenus / Revenus totaux',
                    details: {
                        autres_revenus: this.formatCurrency(this.getAutresRevenus()),
                        revenus_totaux: this.formatCurrency(this.getRevenusTorauxPrevisionnel())
                    }
                },
                R6_couverture: {
                    valeur: this.calculerR6Couverture() + '%',
                    statut: this.getStatutR6(),
                    formule: 'Valeur de la garantie / Crédit',
                    details: {
                        valeur_garantie: this.formatCurrency(this.getValeurGarantie()),
                        montant_credit: this.formatCurrency(this.getMontantCredit())
                    }
                }
            },

            // Évaluation globale
            evaluation: {
                statut_global: this.getEvaluationGlobale(),
                score_risque: this.getScoreRisque(),
                seuils_respectes: this.getNbSeuilsRespetes() + '/6'
            },

            // Recommandations
            recommandations: this.getRecommandations(),
            conseils_amelioration: this.getConseilsAmelioration(),

            // Analyse de risque
            analyse_risque: this.getAnalyseRisque(),

            // Décision recommandée
            decision_recommandee: this.getRecommandationDecision()
        };

        // Affichage dans la console pour copier
        console.log('=== EXPORT ANALYSE COMPLÈTE ===');
        console.log(JSON.stringify(analyseComplete, null, 2));

        // Notification
        this.messageService.add({
            severity: 'success',
            summary: 'Export terminé',
            detail: 'Analyse exportée dans la console (F12 > Console)'
        });

        // Option: téléchargement en fichier JSON
        this.telechargerAnalyseJSON(analyseComplete);
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
}
