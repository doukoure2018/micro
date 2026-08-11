import { AnalyseChargesFonctionnaire, DemandeIndividuel, TAUX_QUOTITE_FONCTIONNAIRE } from '@/interface/demande-individuel.interface';
import { UserService } from '@/service/user.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

registerLocaleData(localeFr, 'fr-FR');

/**
 * Écran d'analyse du crédit fonctionnaire : grille des 12 postes de charges,
 * quotité cessible et capacité résiduelle calculées en direct.
 * Remplace le bilan d'activité / flux de trésorerie des commerçants.
 */
@Component({
    selector: 'app-analyse-charges-fonctionnaire',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputNumberModule, TagModule, TextareaModule, ToastModule],
    templateUrl: './analyse-charges-fonctionnaire.component.html',
    providers: [MessageService]
})
export class AnalyseChargesFonctionnaireComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);

    demandeIndividuelId!: number;

    /** Libellés des 12 postes, dans l'ordre de la grille validée. */
    readonly postes: { key: ChargeKey; libelle: string }[] = [
        { key: 'chargeLoyer', libelle: 'Loyer' },
        { key: 'chargeTransport', libelle: 'Transport' },
        { key: 'chargeNourriture', libelle: 'Nourriture' },
        { key: 'chargeVignette', libelle: 'Vignette' },
        { key: 'chargeAssurance', libelle: 'Assurance' },
        { key: 'chargeElectricite', libelle: 'Électricité' },
        { key: 'chargeEau', libelle: 'Eau' },
        { key: 'chargeAssuranceMaladie', libelle: 'Assurance maladie' },
        { key: 'chargeScolarite', libelle: 'Scolarité' },
        { key: 'chargeCasSociaux', libelle: 'Cas sociaux' },
        { key: 'chargeAbonnementImage', libelle: 'Abonnement image (TV)' },
        { key: 'chargeServiceSalubrite', libelle: 'Service salubrité' }
    ];

    analyse: AnalyseChargesFonctionnaire = this.emptyAnalyse();

    state = signal<{
        loading: boolean;
        saving: boolean;
        soumission: boolean;
        demande?: DemandeIndividuel;
    }>({ loading: true, saving: false, soumission: false });

    ngOnInit(): void {
        this.demandeIndividuelId = +this.route.snapshot.paramMap.get('demandeindividuelId')!;
        forkJoin({
            demande: this.userService.getDemandeWithGaranties$(this.demandeIndividuelId),
            analyse: this.userService.getAnalyseChargesFonctionnaire$(this.demandeIndividuelId)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ demande, analyse }) => {
                    const demandeIndividuel = demande.data?.demandeIndividuel as DemandeIndividuel | undefined;
                    const saved = analyse.data?.analyseCharges as AnalyseChargesFonctionnaire | null;
                    if (saved) {
                        this.analyse = { ...this.emptyAnalyse(), ...saved };
                    } else if (demandeIndividuel?.demandeFonctionnaire?.autresRevenus != null) {
                        this.analyse.autresRevenusRetenus = demandeIndividuel.demandeFonctionnaire.autresRevenus;
                    }
                    this.state.update((s) => ({ ...s, loading: false, demande: demandeIndividuel }));
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || 'Chargement impossible', life: 7000 });
                }
            });
    }

    // ==================== CALCULS EN DIRECT (mêmes formules que le backend) ====================

    salaireNet(): number {
        return this.state().demande?.demandeFonctionnaire?.salaireNetMensuel || 0;
    }

    echeance(): number {
        return this.state().demande?.echeance || 0;
    }

    totalCharges(): number {
        return this.postes.reduce((total, poste) => total + (this.analyse[poste.key] || 0), 0);
    }

    quotiteCessible(): number {
        return Math.round(this.salaireNet() * TAUX_QUOTITE_FONCTIONNAIRE);
    }

    capaciteResiduelle(): number {
        return this.salaireNet() - this.quotiteCessible() + (this.analyse.autresRevenusRetenus || 0) - this.totalCharges();
    }

    echeanceDepasseQuotite(): boolean {
        return this.echeance() > this.quotiteCessible();
    }

    financable(): boolean {
        return this.capaciteResiduelle() >= 0 && this.echeance() > 0 && !this.echeanceDepasseQuotite();
    }

    // ==================== ENREGISTREMENT ====================

    enregistrer(): void {
        this.state.update((s) => ({ ...s, saving: true }));
        this.userService
            .saveAnalyseChargesFonctionnaire$(this.demandeIndividuelId, this.analyse)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const saved = response.data?.analyseCharges as AnalyseChargesFonctionnaire;
                    if (saved) {
                        this.analyse = { ...this.emptyAnalyse(), ...saved };
                    }
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({
                        severity: saved?.verdict === 'FINANCABLE' ? 'success' : 'warn',
                        summary: 'Analyse enregistrée',
                        detail: saved?.verdict === 'FINANCABLE' ? 'Dossier finançable : vous pouvez soumettre la demande à la validation.' : 'Analyse enregistrée mais dossier NON finançable en l’état : la soumission sera bloquée.',
                        life: 7000
                    });
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || "Échec de l'enregistrement", life: 7000 });
                }
            });
    }

    /** L'AC peut soumettre depuis SELECTION (instruction) ou CORRECTION (retour DA). */
    peutSoumettre(): boolean {
        const vs = this.state().demande?.validationState || '';
        return (vs === 'SELECTION' || vs === 'CORRECTION') && this.analyse.analyseChargesId != null;
    }

    /** Soumet le dossier à la validation DA ; le backend re-vérifie quotité et capacité (bloquant). */
    soumettreValidation(): void {
        this.state.update((s) => ({ ...s, soumission: true }));
        this.userService
            .approuverAC$(this.demandeIndividuelId, this.analyse.avisAgent || 'Analyse charges & quotité complétée')
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Dossier soumis',
                        detail: "La demande a été transmise au Directeur d'Agence pour validation",
                        life: 5000
                    });
                    this.state.update((s) => ({ ...s, soumission: false }));
                    setTimeout(() => this.retourDetail(), 1500);
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, soumission: false }));
                    this.messageService.add({ severity: 'error', summary: 'Soumission refusée', detail: error.message || 'Échec de la soumission', life: 9000 });
                }
            });
    }

    retourDetail(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
    }

    private emptyAnalyse(): AnalyseChargesFonctionnaire {
        return {
            chargeLoyer: 0,
            chargeTransport: 0,
            chargeNourriture: 0,
            chargeVignette: 0,
            chargeAssurance: 0,
            chargeElectricite: 0,
            chargeEau: 0,
            chargeAssuranceMaladie: 0,
            chargeScolarite: 0,
            chargeCasSociaux: 0,
            chargeAbonnementImage: 0,
            chargeServiceSalubrite: 0,
            autresRevenusRetenus: 0,
            avisAgent: ''
        };
    }
}

type ChargeKey =
    | 'chargeLoyer'
    | 'chargeTransport'
    | 'chargeNourriture'
    | 'chargeVignette'
    | 'chargeAssurance'
    | 'chargeElectricite'
    | 'chargeEau'
    | 'chargeAssuranceMaladie'
    | 'chargeScolarite'
    | 'chargeCasSociaux'
    | 'chargeAbonnementImage'
    | 'chargeServiceSalubrite';
