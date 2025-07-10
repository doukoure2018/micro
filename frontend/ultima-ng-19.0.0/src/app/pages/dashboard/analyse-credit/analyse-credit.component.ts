import { DemandeCredit } from '@/interface/demande.credit';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { ProgressBarModule } from 'primeng/progressbar';
import { AccordionModule } from 'primeng/accordion';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TooltipModule } from 'primeng/tooltip';
import { DividerModule } from 'primeng/divider';
import { InputIconModule } from 'primeng/inputicon';
import { CreditoDTO } from '@/interface/credito.histo.model';
import { CreditosClienteResponseDTO } from '@/interface/CreditosClienteResponseDTO';

@Component({
    selector: 'app-analyse-credit',
    imports: [CommonModule, FormsModule, TableModule, CardModule, ButtonModule, TagModule, ProgressBarModule, AccordionModule, MessageModule, ProgressSpinnerModule, TooltipModule, DividerModule, InputTextModule, IconFieldModule, InputIconModule],
    templateUrl: './analyse-credit.component.html',
    styleUrl: './analyse-credit.component.scss'
})
export class AnalyseCreditComponent implements OnInit {
    state = signal<{
        histoCredits: CreditosClienteResponseDTO | null;
        demandeAnalyseCredits?: DemandeCredit[];
        user?: IUser;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        searching: boolean;
    }>({
        histoCredits: null,
        demandeAnalyseCredits: [],
        loading: false,
        message: undefined,
        error: undefined,
        searching: false
    });

    // Search query binding
    searchQuery: string = '';

    // Injected services
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);
    private router = inject(Router);
    private activatedRouter = inject(ActivatedRoute);

    ngOnInit(): void {
        this.loadAnalyseEnours();
    }

    private loadAnalyseEnours(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const userId = params.get('userId');
                    const statut = 'EN_ATTENTE';
                    if (userId) {
                        this.state.update((state) => ({
                            ...state,
                            loading: true,
                            message: undefined,
                            error: undefined
                        }));
                        return this.userService.listAnalyseCreditsEncours$(statut, +userId);
                    }
                    return EMPTY;
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IResponse) => {
                    let demandeAnalyseCredits: DemandeCredit[] = [];

                    if (response.data) {
                        if (response.data.demandeAnalyseCredits) {
                            demandeAnalyseCredits = response.data.demandeAnalyseCredits;
                        } else if (response.data.demandeAnalyseCredits) {
                            demandeAnalyseCredits = [response.data.demandeAnalyseCredits];
                        }
                    }

                    this.state.update((state) => ({
                        ...state,
                        demandeAnalyseCredits,
                        loading: false,
                        user: response.data?.user,
                        message: response.message,
                        error: undefined
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({
                        ...state,
                        demandeAnalyseCredits: [],
                        loading: false,
                        message: undefined,
                        error
                    }));
                }
            });
    }

    searchCredits(): void {
        if (!this.searchQuery || this.searchQuery.trim() === '') {
            this.state.update((state) => ({
                ...state,
                message: 'Veuillez saisir un numéro de membre',
                histoCredits: null
            }));
            return;
        }

        this.state.update((state) => ({
            ...state,
            searching: true,
            message: undefined,
            error: undefined,
            histoCredits: null
        }));

        this.userService
            .getAllCreditos$(this.searchQuery)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('API Response:', response);

                    this.state.update((state) => ({
                        ...state,
                        histoCredits: response.data?.histoCredits || null,
                        searching: false,
                        message: response.data?.histoCredits?.mensaje || response.message,
                        error: undefined
                    }));
                },
                error: (error) => {
                    this.state.update((state) => ({
                        ...state,
                        histoCredits: null,
                        searching: false,
                        message: undefined,
                        error: error.message || 'Erreur lors de la recherche'
                    }));
                }
            });
    }

    // UTILITY METHODS FOR DISPLAY
    getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
        switch (status) {
            case 'C':
                return 'success'; // Cancelled/Completed
            case 'A':
                return 'info'; // Active
            case 'I':
                return 'warn'; // Inactive
            case 'V':
                return 'danger'; // Vencido (Expired)
            case 'R':
                return 'secondary'; // Rejected/Refused
            case 'P':
                return 'secondary'; // Pending
            default:
                return 'secondary';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'C':
                return 'Soldé';
            case 'A':
                return 'Actif';
            case 'I':
                return 'Inactif';
            case 'V':
                return 'Échu';
            case 'R':
                return 'Rejeté';
            case 'P':
                return 'En attente';
            default:
                return status;
        }
    }

    getCreditTypeLabel(tipCredito: number): string {
        const types: { [key: number]: string } = {
            1: 'CREDIT RURAL SOLIDAIRE',
            2: 'CREDIT AGRICOLE SOLIDAIRE ORDINAIRE',
            3: 'CREDIT COMMERCIALE SOLIDAIRE',
            4: 'ASSOCIATION DE CAUTION MUTUELLE',
            5: 'CREDIT STOCKAGE ET EMBOUCHE',
            6: 'CREDIT MOYEN TERME',
            7: 'CREDIT FONCTIONNAIRES EPARGNANTS',
            8: 'CREDIT DEPANNAGE FONCTIONNAIRES ET RETRAITES',
            9: 'CREDIT MOURABAHA',
            10: 'CREDIT AGRICOLE SOLIDAIRE RENTE',
            11: 'CREDIT COMMERCIAL PECHE',
            12: 'CREDIT OIM',
            13: 'CREDIT ELUS',
            14: 'CREDIT ANAMIF',
            15: 'CREDITS CT PERSONNEL CDS',
            16: 'CREDITS CT PERSONNEL PRETS SOCIAUX',
            17: 'CREDITS CT PERSONNEL PRETS VEHICULE',
            18: 'CREDITS MT PERSONNEL CDS',
            19: 'CREDITS MT PERSONNEL PRETS SOCIAUX',
            20: 'CREDITS MT PERSONNEL PRETS VEHICULE',
            21: 'CREDITS LT PERSONNE CDS',
            22: 'CREDITS LT PERSONNEL PRETS SOCIAUX',
            23: 'CREDITS LT PERSONNEL PRETS VEHICULE',
            24: 'CREDIT WARRANTAGE',
            25: 'CREDIT TONTINE',
            26: 'CREDIT MOTEUR HORS BORD',
            27: 'CREDIT PROJET VILLAGE DURABLE GUINEE',
            28: 'CREDIT AVANCE SALAIRE FONCTIONAIRES VIRES',
            29: 'CREDIT PRÊTS SCOLAIRES',
            30: 'CREDIT PRETS EQUIPEMENTS',
            31: 'CREDIT PRÊTS INVESTISSEMENTS FONCTIONNAIRE',
            32: 'CREDIT BOEUF PDABAD',
            33: 'MICROCREDIT KIOSQUE',
            34: 'CREDIT EXPLOITATION AGRICOLE',
            35: 'CREDIT INTRANTS ET TRANSFORMATION PRODUITS AGRICOLES',
            36: 'CREDIT EQUIPEMENT AGRICOLE',
            37: 'CREDIT AGRICOLE PRODUCTION ANANAS',
            38: 'CREDIT EXTENSION AGRICOLE',
            39: 'CREDIT MOTO BAJAJ',
            40: 'CREDIT PERFORM WORLD',
            41: 'CREDIT EQUIPEMENT PERFORM WORLD',
            42: 'CREDIT PRODUCTION AGRICOLE',
            43: 'CREDIT TRANSFORMATION COMMERCIALISATION PRODUITS',
            44: 'CREDIT EQUIPEMENT AGRICOLE ET DE TRANSFORMATION PRODUITS',
            45: 'PASSEPORT BRIQUETERIE',
            46: 'PASSEPORT PDV CIMENT',
            47: 'PASSEPORT SALARIE',
            100: 'CREDITS REGULARISE OPS'
        };
        return types[tipCredito] || `Type ${tipCredito}`;
    }

    formatCurrency(amount: number): string {
        if (!amount) return '0 GNF';
        return new Intl.NumberFormat('fr-GN', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    }

    formatDate(dateString: string): string {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('fr-FR');
    }

    calculateProgress(credit: CreditoDTO): number {
        if (!credit.monCredito || credit.monCredito === 0) return 0;
        return (credit.monPagadoPrincipal / credit.monCredito) * 100;
    }

    // NAVIGATION METHODS
    viewDetailCredit(numberCredit: string): void {
        this.router.navigate([`dashboards/credit/detail/${numberCredit}`]);
    }

    viewDetailDemandeCredit(demandeId: number, userId: number): void {
        console.log('Demande ID:', demandeId);
        console.log('User ID:', userId);
        this.router.navigate([`dashboards/credit/${userId}/resume-credit/${demandeId}`]);
    }

    newAnalyseCredit(userId: number): void {
        this.router.navigate([`dashboards/credit/${userId}/new-step`]);
    }

    viewPlanPago(numCredito: number): void {
        setTimeout(() => {
            const element = document.querySelector(`[data-credit-plan="${numCredito}"]`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                const planSection = document.querySelector('.payment-plans-section');
                if (planSection) {
                    planSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }, 100);
    }

    clearSearch(): void {
        this.searchQuery = '';
        this.state.update((state) => ({
            ...state,
            histoCredits: null,
            message: undefined,
            error: undefined
        }));
    }

    // ADDITIONAL UTILITY METHODS
    getTotalCreditsAmount(): number {
        const credits = this.state().histoCredits?.creditos || [];
        return credits.reduce((sum, credit) => sum + credit.monCredito, 0);
    }

    getTotalPaidAmount(): number {
        const credits = this.state().histoCredits?.creditos || [];
        return credits.reduce((sum, credit) => sum + credit.monPagadoPrincipal, 0);
    }

    getTotalRemainingAmount(): number {
        const credits = this.state().histoCredits?.creditos || [];
        return credits.reduce((sum, credit) => sum + credit.monSaldo, 0);
    }

    getActiveCreditsCount(): number {
        const credits = this.state().histoCredits?.creditos || [];
        return credits.filter((credit) => credit.indEstado === 'A').length;
    }

    getCompletedCreditsCount(): number {
        const credits = this.state().histoCredits?.creditos || [];
        return credits.filter((credit) => credit.indEstado === 'C').length;
    }

    // UPDATED RISK ASSESSMENT - Now uses data from API
    getRiskAssessment(): { level: string; score: number; factors: string[] } | null {
        const evaluationRisque = this.state().histoCredits?.evaluationRisque;

        if (!evaluationRisque) {
            return null;
        }

        // Convert API risk level to display format
        let displayLevel = evaluationRisque.niveauRisque;

        // Build factors array based on the evaluation
        const factors: string[] = [];
        factors.push(evaluationRisque.historiqueRemboursement);

        if (evaluationRisque.echeancesAnalysees > 0) {
            const respectRate = (evaluationRisque.echeancesRespectees / evaluationRisque.echeancesAnalysees) * 100;
            if (respectRate < 50) {
                factors.push(`Seulement ${respectRate.toFixed(0)}% des échéances respectées`);
            }
        }

        if (evaluationRisque.creditsAnalyses > 0) {
            factors.push(`Analyse basée sur ${evaluationRisque.creditsAnalyses} crédit(s)`);
        }

        return {
            level: displayLevel,
            score: evaluationRisque.scoreConfiance,
            factors: factors
        };
    }

    // Get risk level color class
    getRiskLevelColorClass(level: string): string {
        switch (level) {
            case 'TRÈS FAIBLE':
                return 'text-green-600';
            case 'FAIBLE':
                return 'text-blue-600';
            case 'MODÉRÉ':
                return 'text-orange-600';
            case 'ÉLEVÉ':
                return 'text-orange-600';
            case 'TRÈS ÉLEVÉ':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    }

    // EXPORT FUNCTIONALITY
    exportCreditHistory(): void {
        const histoCredits = this.state().histoCredits;
        if (!histoCredits) return;

        const exportData = {
            client: histoCredits.codCliente,
            credits: histoCredits.creditos,
            planPagos: histoCredits.planPagos,
            resumenes: histoCredits.resumenes,
            evaluationRisque: histoCredits.evaluationRisque,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `historique_credit_${histoCredits.codCliente}_${new Date().toISOString().split('T')[0]}.json`;
        link.click();

        URL.revokeObjectURL(link.href);
    }

    getPlanPagosByCredit(numCredito: number): any[] {
        const planPagos = this.state().histoCredits?.planPagos || [];
        // Exclure les échéances d'ouverture (numCuota === 0)
        return planPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
    }

    // 2. Nouvelle méthode pour obtenir TOUS les plans incluant l'ouverture (pour l'affichage dans la table)
    getAllPlanPagosByCredit(numCredito: number): any[] {
        const planPagos = this.state().histoCredits?.planPagos || [];
        return planPagos.filter((plan) => plan.numCredito === numCredito);
    }

    getPaidInstallments(planPagos: any[]): number {
        // Compter uniquement les échéances réelles payées (exclure numCuota === 0)
        return planPagos.filter((plan) => plan.indEstado === 'C' && plan.numCuota !== 0).length;
    }

    getRemainingInstallments(planPagos: any[]): number {
        // Compter uniquement les échéances réelles restantes (exclure numCuota === 0)
        return planPagos.filter((plan) => (plan.indEstado === 'A' || plan.indEstado === 'P') && plan.numCuota !== 0).length;
    }

    getCreditStatistics(numCredito: number): {
        totalEcheances: number;
        echeancesPagees: number;
        echeancesRestantes: number;
        montantTotal: number;
        montantPaye: number;
        soldeRestant: number;
    } {
        const allPlanPagos = this.state().histoCredits?.planPagos || [];
        // Filtrer pour exclure les échéances d'ouverture (numCuota === 0)
        const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
        const credit = this.state().histoCredits?.creditos?.find((c) => c.numCredito === numCredito);

        return {
            totalEcheances: planPagos.length,
            echeancesPagees: planPagos.filter((plan) => plan.indEstado === 'C').length,
            echeancesRestantes: planPagos.filter((plan) => plan.indEstado === 'A' || plan.indEstado === 'P').length,
            montantTotal: credit?.monCredito || 0,
            montantPaye: credit?.monPagadoPrincipal || 0,
            soldeRestant: credit?.monSaldo || 0
        };
    }

    hasOverdueInstallments(numCredito: number): boolean {
        const allPlanPagos = this.state().histoCredits?.planPagos || [];
        // Filtrer pour exclure les échéances d'ouverture
        const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
        const today = new Date();

        return planPagos.some((plan) => {
            if (plan.indEstado === 'C') return false;

            const dueDate = new Date(plan.fecCuota);
            return dueDate < today;
        });
    }

    getNextInstallment(numCredito: number): any | null {
        const allPlanPagos = this.state().histoCredits?.planPagos || [];
        // Filtrer pour exclure les échéances d'ouverture
        const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
        const today = new Date();

        const futureInstallments = planPagos.filter((plan) => plan.indEstado === 'A' && new Date(plan.fecCuota) >= today).sort((a, b) => new Date(a.fecCuota).getTime() - new Date(b.fecCuota).getTime());

        return futureInstallments.length > 0 ? futureInstallments[0] : null;
    }

    getTotalInterestForCredit(numCredito: number): number {
        const allPlanPagos = this.state().histoCredits?.planPagos || [];
        // Filtrer pour exclure les échéances d'ouverture
        const planPagos = allPlanPagos.filter((plan) => plan.numCredito === numCredito && plan.numCuota !== 0);
        return planPagos.reduce((total, plan) => total + (plan.monInt || 0), 0);
    }

    getTotalEcheancesWithoutOpening(): number {
        const planPagos = this.state().histoCredits?.planPagos || [];
        return planPagos.filter((plan) => plan.numCuota !== 0).length;
    }

    printCreditHistory(): void {
        window.print();
    }
}
