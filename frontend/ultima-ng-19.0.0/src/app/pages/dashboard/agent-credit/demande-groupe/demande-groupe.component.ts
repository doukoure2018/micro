import { DemandeGroupe, DemandeIndividuel, GarantiePropose, MembreGroupe, NATURE_CREDIT_GROUPE, TYPES_GROUPE_OPTIONS, TypeGroupe, demandeGroupeVide, membreGroupeVide } from '@/interface/demande-individuel.interface';
import { Activite, CreditActiviteData, SousActivite, SousSousActivite } from '@/service/credit-activite.model';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule, registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';

registerLocaleData(localeFr, 'fr-FR');

/**
 * Demande de crédit pour Groupe Solidaire (nature « Groupe Solidaire », V124).
 * Formulaire uniforme pour les 7 types (CAS, CAS-R, CCS, CRS, CFE, MCK, ACM) :
 * le type pilote le tip_credito, le taux proposé et les colonnes PE des membres (CFE).
 * L'échéancier CAS/CAS-R est prévisualisé en direct (capital constant, intérêt
 * identique par échéance — formule confirmée pour 2 échéances le 2026-08-27 ;
 * les cas 1 et 3 échéances seront affinés quand le métier fournira les règles).
 */
@Component({
    selector: 'app-demande-groupe',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, CalendarModule, CheckboxModule, DialogModule, DropdownModule, InputNumberModule, InputTextModule, ProgressSpinnerModule, TableModule, TagModule, TextareaModule, ToastModule, TooltipModule],
    templateUrl: './demande-groupe.component.html',
    providers: [MessageService]
})
export class DemandeGroupeComponent implements OnInit {
    private readonly userService = inject(UserService);
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly messageService = inject(MessageService);

    today = new Date();
    typesGroupe = TYPES_GROUPE_OPTIONS;
    activites: Activite[] = CreditActiviteData.ACTIVITES;
    activiteOptions = this.activites.map((a) => ({ label: a.libelle, value: a.code }));
    sousActiviteOptions: { label: string; value: number }[] = [];
    sousSousActiviteOptions: { label: string; value: number }[] = [];
    periodiciteOptions = [
        { label: 'Mensuelle', value: 'Mensuelle' },
        { label: 'Bimestrielle', value: 'Bimestrielle' },
        { label: 'Trimestrielle', value: 'Trimestrielle' },
        { label: 'Semestrielle', value: 'Semestrielle' }
    ];
    objectCreditOptions = [
        { label: 'Fond de roulement', value: 'Fond de roulement' },
        { label: 'Investissement', value: 'Investissement' },
        { label: 'Campagne agricole', value: 'Campagne agricole' },
        { label: 'Autre', value: 'Autre' }
    ];
    typeGarantieOptions = [
        { label: 'Garantie Financière', value: 'Garantie Financiere' },
        { label: 'Garantie Matérielle', value: 'Garantie Materielle' },
        { label: 'Caution Solidaire', value: 'Caution Solidaire' },
        { label: 'Autre Garantie', value: 'Autre Garantie' }
    ];

    groupe: DemandeGroupe = demandeGroupeVide();
    membres: MembreGroupe[] = [membreGroupeVide()];

    /** Mode correction : id de la demande rejetée (DA/DR/DE) à modifier et resoumettre. */
    demandeId: number | null = null;
    correction: { motif?: string; sections?: string; instructions?: string } = {};

    pret = {
        delegation: undefined as any,
        agence: undefined as any,
        pos: undefined as any,
        numeroMembreGroupe: '',
        objectCredit: 'Fond de roulement',
        detailObjectCredit: '',
        autreAPreciser: '',
        montantDemande: 0,
        dureeDemande: 6,
        nombreEcheance: 2,
        tauxInteret: 3,
        periodiciteRemboursement: 'Mensuelle',
        echeance: 0,
        selectedTypeActivite: undefined as number | undefined,
        selectedSousActivite: undefined as number | undefined,
        selectedSousSousActivite: undefined as number | undefined,
        nombreAnneeActivite: 0
    };

    state = signal<{
        loading: boolean;
        submitting: boolean;
        allDelegations: any[];
        allAgences: any[];
        allPointsVente: any[];
        filteredAgences: any[];
        filteredPointsVente: any[];
        garanties: GarantiePropose[];
        showGarantieDialog: boolean;
        currentGarantie: GarantiePropose;
        editingGarantieIndex?: number;
    }>({
        loading: false,
        submitting: false,
        allDelegations: [],
        allAgences: [],
        allPointsVente: [],
        filteredAgences: [],
        filteredPointsVente: [],
        garanties: [],
        showGarantieDialog: false,
        currentGarantie: this.garantieVide()
    });

    /** Vérification SAF asynchrone : ne bloque pas la saisie (décision 2026-08-27). */
    private verificationMembre$ = new Subject<MembreGroupe>();

    ngOnInit(): void {
        const param = this.route.snapshot.paramMap.get('demandeId');
        this.demandeId = param ? +param : null;
        this.loadInitialData();
        if (this.demandeId) {
            this.chargerDemandeExistante(this.demandeId);
        }
        this.verificationMembre$
            .pipe(
                debounceTime(600),
                switchMap((membre) =>
                    this.userService.existNumeroMembre$(membre.numeroMembre as any).pipe(
                        catchError(() => of(null)),
                        switchMap((response: IResponse | null) => of({ membre, response }))
                    )
                ),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(({ membre, response }) => {
                if (!response) {
                    membre.verification = undefined; // service indisponible : ne pas bloquer
                    return;
                }
                membre.verification = (response.data as any)?.existMembre ? 'trouve' : 'introuvable';
            });
    }

    estCorrection(): boolean {
        return this.demandeId !== null;
    }

    /** Charge la demande groupe rejetée : extension, membres, garanties et modalités. */
    private chargerDemandeExistante(demandeId: number): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .getDemandeWithGaranties$(demandeId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const demande = (response.data as any)?.demandeIndividuel as DemandeIndividuel | undefined;
                    if (!demande || !demande.demandeGroupe) {
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: "Cette demande n'est pas une demande groupe", life: 6000 });
                        this.router.navigate(['/dashboards/credit/individuel/attente']);
                        return;
                    }
                    this.groupe = { ...demandeGroupeVide(), ...demande.demandeGroupe,
                        dateAdhesion: demande.demandeGroupe.dateAdhesion ? new Date(demande.demandeGroupe.dateAdhesion as string) : null };
                    this.membres = (demande.membresGroupe && demande.membresGroupe.length > 0)
                        ? demande.membresGroupe.map((m) => ({ ...m })) : [membreGroupeVide()];
                    this.pret.numeroMembreGroupe = demande.numeroMembre || '';
                    this.pret.objectCredit = demande.objectCredit || 'Fond de roulement';
                    this.pret.detailObjectCredit = demande.detailObjectCredit || '';
                    this.pret.montantDemande = Number(demande.montantDemande) || 0;
                    this.pret.dureeDemande = Number(demande.dureeDemande) || 6;
                    this.pret.nombreEcheance = Number(demande.nombreEcheance) || 2;
                    this.pret.tauxInteret = Number(demande.tauxInteret) || 3;
                    this.pret.periodiciteRemboursement = demande.periodiciteRemboursement || 'Mensuelle';
                    this.pret.echeance = Number(demande.echeance) || 0;
                    this.pret.nombreAnneeActivite = Number(demande.nombreAnneeActivite) || 0;
                    this.pret.selectedTypeActivite = demande.typeActivite ? Number(demande.typeActivite) : undefined;
                    if (this.pret.selectedTypeActivite) {
                        this.sousActiviteOptions = CreditActiviteData.getSousActivitesByActivite(this.pret.selectedTypeActivite).map((sa) => ({ label: sa.libelle, value: sa.code }));
                        this.pret.selectedSousActivite = demande.sousActivite ? Number(demande.sousActivite) : undefined;
                        if (this.pret.selectedSousActivite) {
                            this.sousSousActiviteOptions = CreditActiviteData.getSousSousActivites(this.pret.selectedTypeActivite, this.pret.selectedSousActivite).map((ssa) => ({ label: ssa.libelle, value: ssa.code }));
                            this.pret.selectedSousSousActivite = demande.sousSousActivite ? Number(demande.sousSousActivite) : undefined;
                        }
                    }
                    this.correction = {
                        motif: (demande as any).motifRejetDa || (demande as any).motifRejetDr || (demande as any).motifRejetDe,
                        sections: (demande as any).sectionsARevoirDa || (demande as any).sectionsARevoirDr || (demande as any).sectionsARevoirDe,
                        instructions: (demande as any).instructionsAc
                    };
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        garanties: ((demande as any).garanties || []).map((g: any) => ({ ...g }))
                    }));
                },
                error: () => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Chargement de la demande impossible', life: 6000 });
                }
            });
    }

    private loadInitialData(): void {
        this.state.update((s) => ({ ...s, loading: true }));
        this.userService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({
                        ...s,
                        loading: false,
                        allDelegations: response.data?.delegations || [],
                        allAgences: response.data?.agences || [],
                        allPointsVente: response.data?.pointVentes || []
                    }));
                },
                error: () => {
                    this.state.update((s) => ({ ...s, loading: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Impossible de charger les données initiales', life: 5000 });
                }
            });
    }

    // ==================== CASCADES ====================

    onDelegationChange(event: any): void {
        this.pret.agence = undefined;
        this.pret.pos = undefined;
        const delegation = event.value;
        const filteredAgences = (this.state().allAgences || []).filter((a: any) => (a.delegation_id || a.delegationId || a.delegation?.id || a.idDelegation) === delegation?.id);
        this.state.update((s) => ({ ...s, filteredAgences, filteredPointsVente: [] }));
    }

    onAgenceChange(event: any): void {
        this.pret.pos = undefined;
        const agence = event.value;
        const filteredPointsVente = (this.state().allPointsVente || []).filter((pv: any) => (pv.agence_id || pv.agenceId || pv.agence?.id || pv.idAgence) === agence?.id);
        this.state.update((s) => ({ ...s, filteredPointsVente }));
    }

    onActiviteChange(event: any): void {
        this.pret.selectedSousActivite = undefined;
        this.pret.selectedSousSousActivite = undefined;
        this.sousSousActiviteOptions = [];
        const code = event.value as number;
        this.sousActiviteOptions = code ? CreditActiviteData.getSousActivitesByActivite(code).map((sa: SousActivite) => ({ label: sa.libelle, value: sa.code })) : [];
    }

    onSousActiviteChange(event: any): void {
        this.pret.selectedSousSousActivite = undefined;
        const codeActivite = this.pret.selectedTypeActivite;
        const code = event.value as number;
        this.sousSousActiviteOptions = codeActivite && code ? CreditActiviteData.getSousSousActivites(codeActivite, code).map((ssa: SousSousActivite) => ({ label: ssa.libelle, value: ssa.code })) : [];
    }

    // ==================== TYPE DE GROUPE ====================

    typeGroupeSelectionne(): TypeGroupe | undefined {
        return this.typesGroupe.find((t) => t.code === this.groupe.typeGroupe);
    }

    isCfe(): boolean {
        return this.groupe.typeGroupe === 'CFE';
    }

    isAgricole(): boolean {
        return this.groupe.typeGroupe === 'CAS' || this.groupe.typeGroupe === 'CAS_R';
    }

    onTypeGroupeChange(): void {
        const type = this.typeGroupeSelectionne();
        if (type) {
            this.pret.tauxInteret = type.tauxDefaut; // pré-rempli mais modifiable
        }
        if (this.isCfe()) {
            // Même règle que le fonctionnaire individuel : mensuelle uniquement
            this.pret.periodiciteRemboursement = 'Mensuelle';
        }
    }

    /** CFE : cumul des salaires nets des membres = base de la quotité cessible du groupe (35 %). */
    totalSalairesCfe(): number {
        return this.membres.reduce((total, m) => total + (m.salaireNetMensuel || 0), 0);
    }

    // ==================== MEMBRES ====================

    ajouterMembre(): void {
        this.membres.push(membreGroupeVide());
        this.groupe.nombreMembres = this.membres.length;
    }

    supprimerMembre(index: number): void {
        this.membres.splice(index, 1);
        this.groupe.nombreMembres = this.membres.length;
    }

    onNumeroMembreChange(membre: MembreGroupe): void {
        if (membre.numeroMembre && membre.numeroMembre.trim().length >= 4) {
            membre.verification = 'en_cours';
            this.verificationMembre$.next(membre);
        } else {
            membre.verification = undefined;
        }
    }

    totalParts(): number {
        return this.membres.reduce((total, m) => total + (m.montantPercevoir || 0), 0);
    }

    partsEgalesMontant(): boolean {
        return this.totalParts() === (this.pret.montantDemande || 0) && this.totalParts() > 0;
    }

    // ==================== ÉCHÉANCIER CAS / CAS-R ====================

    /**
     * Capital constant, intérêt identique par échéance : I = (Montant / N) x taux.
     * Formule confirmée pour N = 2 ; à affiner pour N = 1 et N = 3 (règles à venir du métier).
     */
    echeancier(): { numero: number; capital: number; interet: number; montant: number }[] {
        const montant = this.pret.montantDemande || 0;
        const n = this.pret.nombreEcheance || 0;
        const taux = (this.pret.tauxInteret || 0) / 100;
        if (!this.isAgricole() || montant <= 0 || n <= 0) return [];
        const capital = montant / n;
        const interet = capital * taux;
        return Array.from({ length: n }, (_, i) => ({
            numero: i + 1,
            capital: Math.round(capital),
            interet: Math.round(interet),
            montant: Math.round(capital + interet)
        }));
    }

    totalEcheances(): number {
        return this.echeancier().reduce((total, e) => total + e.montant, 0);
    }

    // ==================== GARANTIES ====================

    private garantieVide(): GarantiePropose {
        return { typeGarantie: undefined, descriptionGarantie: '', valeurGarantie: 0, valeurEmprunte: 0 };
    }

    showAddGarantieDialog(): void {
        this.state.update((s) => ({ ...s, showGarantieDialog: true, currentGarantie: this.garantieVide(), editingGarantieIndex: undefined }));
    }

    editGarantie(index: number): void {
        this.state.update((s) => ({ ...s, showGarantieDialog: true, currentGarantie: { ...s.garanties[index] }, editingGarantieIndex: index }));
    }

    deleteGarantie(index: number): void {
        this.state.update((s) => ({ ...s, garanties: s.garanties.filter((_, i) => i !== index) }));
    }

    saveGarantie(): void {
        const current = this.state().currentGarantie;
        current.valeurEmprunte = Math.round((current.valeurGarantie || 0) * 0.75);
        this.state.update((s) => {
            const garanties = [...s.garanties];
            if (s.editingGarantieIndex !== undefined) {
                garanties[s.editingGarantieIndex] = { ...current };
            } else {
                garanties.push({ ...current });
            }
            return { ...s, garanties, showGarantieDialog: false, editingGarantieIndex: undefined, currentGarantie: this.garantieVide() };
        });
    }

    cancelGarantie(): void {
        this.state.update((s) => ({ ...s, showGarantieDialog: false, editingGarantieIndex: undefined }));
    }

    totalGaranties(): number {
        return this.state().garanties.reduce((t, g) => t + (g.valeurGarantie || 0), 0);
    }

    // ==================== SOUMISSION ====================

    peutSoumettre(): boolean {
        return this.partsEgalesMontant() && !!this.groupe.typeGroupe && !!this.groupe.nomGroupe && !!this.groupe.mandataire1 && !!this.groupe.contactMandataire1 && (this.isCfe() || this.state().garanties.length > 0);
    }

    creerDemande(form: NgForm): void {
        if (form.invalid) {
            Object.keys(form.controls).forEach((key) => form.controls[key].markAsTouched());
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs obligatoires', life: 5000 });
            return;
        }
        if (!this.partsEgalesMontant()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Montants incohérents',
                detail: `La somme des montants à percevoir (${this.totalParts().toLocaleString('fr-FR')} GNF) doit être égale au montant demandé (${(this.pret.montantDemande || 0).toLocaleString('fr-FR')} GNF)`,
                life: 7000
            });
            return;
        }
        if (!this.isCfe() && this.state().garanties.length === 0) {
            this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Au moins une garantie est requise', life: 5000 });
            return;
        }

        const type = this.typeGroupeSelectionne();
        const delegationValue = this.pret.delegation as any;
        const agenceValue = this.pret.agence as any;
        const posValue = this.pret.pos as any;

        const demandeData = {
            nom: this.groupe.nomGroupe,
            prenom: '',
            telephone: this.groupe.contactMandataire1,
            numeroMembre: this.pret.numeroMembreGroupe,
            delegation: delegationValue?.id || delegationValue,
            agence: agenceValue?.id || agenceValue,
            pos: posValue?.id || posValue,
            natureClient: NATURE_CREDIT_GROUPE,
            typePiece: '',
            numId: '',
            genre: '',
            situationMatrimoniale: '',
            nombrePersonneEnCharge: this.groupe.nombreMembres,
            nombrePersonneScolarise: 0,
            addresseDomicileContact: [this.groupe.districtQuartier, this.groupe.secteur].filter(Boolean).join(' / '),
            typePropriete: '',
            nombreAnneeHabitation: 0,
            typeActivite: this.pret.selectedTypeActivite ? String(this.pret.selectedTypeActivite) : '',
            sousActivite: this.pret.selectedSousActivite ? String(this.pret.selectedSousActivite) : '',
            sousSousActivite: this.pret.selectedSousSousActivite ? String(this.pret.selectedSousSousActivite) : '',
            descriptionActivite: this.pret.autreAPreciser || '',
            nombreAnneeActivite: this.pret.nombreAnneeActivite,
            adresseLieuActivite: [this.groupe.districtQuartier, this.groupe.secteur].filter(Boolean).join(' / '),
            montantDemande: this.pret.montantDemande,
            dureeDemande: this.pret.dureeDemande,
            periodiciteRemboursement: this.pret.periodiciteRemboursement,
            tauxInteret: this.pret.tauxInteret,
            periodeDiffere: 0,
            nombreEcheance: this.pret.nombreEcheance,
            echeance: this.isAgricole() && this.echeancier().length > 0 ? this.echeancier()[0].montant : this.pret.echeance,
            objectCredit: this.pret.objectCredit,
            detailObjectCredit: this.pret.detailObjectCredit || this.pret.objectCredit,
            statutCredit: 'Nouveau',
            rangCredit: 1,
            tipCredito: type?.tipCredito,
            statutDemande: 'EN_ATTENTE',
            validationState: 'SELECTION',
            currentActivite: this.pret.selectedTypeActivite ? CreditActiviteData.getActiviteByCode(this.pret.selectedTypeActivite)?.libelle || '' : '',
            demandeGroupe: { ...this.groupe, nombreMembres: this.membres.length },
            membresGroupe: this.membres.map(({ verification, ...membre }) => membre),
            garanties: this.isCfe() ? [] : this.state().garanties
        } as unknown as DemandeIndividuel;

        this.state.update((s) => ({ ...s, submitting: true }));

        if (this.estCorrection() && this.demandeId) {
            // Correction : mise à jour de la demande + extension + membres, puis retour au
            // détail où l'agent resoumet (bouton « Resoumettre les corrections »)
            this.userService
                .updateDemandeComplete$(this.demandeId, demandeData)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Corrections sauvegardées — resoumettez la demande depuis le détail', life: 5000 });
                        this.state.update((s) => ({ ...s, submitting: false }));
                        setTimeout(() => this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeId]), 1200);
                    },
                    error: (error) => {
                        this.state.update((s) => ({ ...s, submitting: false }));
                        this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || error || 'Échec de la sauvegarde', life: 8000 });
                    }
                });
            return;
        }

        this.userService
            .addDemandeIndWithGaranties$(demandeData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const demandeId = (response.data as any)?.demandeId;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Demande groupe créée avec succès. ID: ${demandeId || 'N/A'}`,
                        life: 5000
                    });
                    this.state.update((s) => ({ ...s, submitting: false }));
                    setTimeout(() => this.router.navigate(['/dashboards/credit/individuel/attente']), 1200);
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, submitting: false }));
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: error.message || error || 'Échec de la soumission', life: 8000 });
                }
            });
    }
}
