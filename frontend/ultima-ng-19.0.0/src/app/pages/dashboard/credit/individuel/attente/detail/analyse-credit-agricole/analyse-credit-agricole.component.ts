import { AnalyseCreditAgricole, DemandeIndividuel, analyseCreditAgricoleVide } from '@/interface/demande-individuel.interface';
import { UserService } from '@/service/user.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

registerLocaleData(localeFr, 'fr-FR');

/**
 * Écran d'analyse du crédit agricole solidaire (groupes CAS / CAS-R) :
 * grille des 12 postes de charges de campagne, produits escomptés,
 * marge nette comparée en direct au total des échéances (capital constant,
 * intérêt identique par échéance — formule confirmée pour 2 échéances).
 * Remplace le bilan d'activité / flux de trésorerie du commerçant.
 */
@Component({
    selector: 'app-analyse-credit-agricole',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule, ButtonModule, InputNumberModule, TagModule, ToastModule, TooltipModule],
    templateUrl: './analyse-credit-agricole.component.html',
    providers: [MessageService]
})
export class AnalyseCreditAgricoleComponent implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly destroyRef = inject(DestroyRef);
    private readonly userService = inject(UserService);
    private readonly messageService = inject(MessageService);

    demandeIndividuelId!: number;

    /** Libellés des 12 postes de charges de campagne, dans l'ordre validé. */
    readonly postes: { key: ChargeKey; libelle: string }[] = [
        { key: 'fraisLabour', libelle: 'Frais de labour' },
        { key: 'fraisCloture', libelle: 'Frais de clôture' },
        { key: 'achatIntrant', libelle: 'Achat intrants' },
        { key: 'achatPhytosanitaire', libelle: 'Produits phytosanitaires' },
        { key: 'achatOutillage', libelle: 'Outillage et petit matériel' },
        { key: 'fraisEntretien', libelle: 'Entretien (binage, buttage, désherbage)' },
        { key: 'fraisSemis', libelle: 'Frais liés aux semis' },
        { key: 'fraisRecolte', libelle: 'Frais liés à la récolte' },
        { key: 'transport', libelle: 'Transport' },
        { key: 'stockage', libelle: 'Stockage' },
        { key: 'fraisConservation', libelle: 'Frais de conservation' },
        { key: 'chargesFamiliales', libelle: 'Charges familiales' }
    ];

    analyse: AnalyseCreditAgricole = analyseCreditAgricoleVide();

    state = signal<{
        loading: boolean;
        saving: boolean;
        demande?: DemandeIndividuel;
    }>({ loading: true, saving: false });

    ngOnInit(): void {
        this.demandeIndividuelId = +this.route.snapshot.paramMap.get('demandeindividuelId')!;
        forkJoin({
            demande: this.userService.getDemandeWithGaranties$(this.demandeIndividuelId),
            analyse: this.userService.getAnalyseAgricole$(this.demandeIndividuelId)
        })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: ({ demande, analyse }) => {
                    const demandeIndividuel = (demande.data as any)?.demandeIndividuel as DemandeIndividuel | undefined;
                    const saved = (analyse.data as any)?.analyseAgricole as AnalyseCreditAgricole | null;
                    if (saved) {
                        this.analyse = { ...analyseCreditAgricoleVide(), ...saved };
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

    estAgricole(): boolean {
        return ['CAS', 'CAS_R'].includes(this.state().demande?.demandeGroupe?.typeGroupe || '');
    }

    montantCredit(): number {
        return Number(this.state().demande?.montantDemande) || 0;
    }

    tauxInteret(): number {
        return Number(this.state().demande?.tauxInteret) || 0;
    }

    nombreEcheances(): number {
        return Number(this.state().demande?.nombreEcheance) || 0;
    }

    totalCharges(): number {
        return this.postes.reduce((total, poste) => total + (Number(this.analyse[poste.key]) || 0), 0);
    }

    totalProduits(): number {
        return (Number(this.analyse.quantiteRecolte) || 0) * (Number(this.analyse.prixVenteUnitaire) || 0) + (Number(this.analyse.autresProduits) || 0);
    }

    margeNette(): number {
        return this.totalProduits() - this.totalCharges();
    }

    /** Total échéances = montant x (1 + taux/100) — capital constant, intérêt identique par échéance. */
    totalEcheances(): number {
        return Math.round(this.montantCredit() * (1 + this.tauxInteret() / 100));
    }

    echeancier(): { numero: number; capital: number; interet: number; montant: number }[] {
        const montant = this.montantCredit();
        const n = this.nombreEcheances();
        if (montant <= 0 || n <= 0) return [];
        const capital = montant / n;
        const interet = capital * (this.tauxInteret() / 100);
        return Array.from({ length: n }, (_, i) => ({
            numero: i + 1,
            capital: Math.round(capital),
            interet: Math.round(interet),
            montant: Math.round(capital + interet)
        }));
    }

    financable(): boolean {
        return this.margeNette() > this.totalEcheances();
    }

    // ==================== ENREGISTREMENT ====================

    enregistrer(): void {
        this.state.update((s) => ({ ...s, saving: true }));
        this.userService
            .saveAnalyseAgricole$(this.demandeIndividuelId, this.analyse)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const saved = (response.data as any)?.analyseAgricole as AnalyseCreditAgricole;
                    if (saved) {
                        this.analyse = { ...analyseCreditAgricoleVide(), ...saved };
                    }
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({
                        severity: saved?.verdict === 'FINANCABLE' ? 'success' : 'warn',
                        summary: 'Analyse enregistrée',
                        detail: saved?.verdict === 'FINANCABLE'
                            ? 'Dossier finançable : donnez votre avis et approuvez la demande depuis le détail.'
                            : 'Analyse enregistrée mais dossier NON finançable en l’état : la marge nette doit dépasser le total des échéances.',
                        life: 7000
                    });
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, saving: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || "Échec de l'enregistrement", life: 7000 });
                }
            });
    }

    retourDetail(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
    }
}

type ChargeKey =
    | 'fraisLabour'
    | 'fraisCloture'
    | 'achatIntrant'
    | 'achatPhytosanitaire'
    | 'achatOutillage'
    | 'fraisEntretien'
    | 'fraisSemis'
    | 'fraisRecolte'
    | 'transport'
    | 'stockage'
    | 'fraisConservation'
    | 'chargesFamiliales';
