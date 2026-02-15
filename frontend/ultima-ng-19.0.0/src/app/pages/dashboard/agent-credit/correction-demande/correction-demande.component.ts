import { Agence } from '@/interface/agence';
import { Delegation } from '@/interface/delegation';
import { DemandeIndividuel, GarantiePropose } from '@/interface/demande-individuel.interface';
import { PointVente } from '@/interface/point.vente';
import { TypeCreditDto } from '@/interface/typeCredit.model';
import { Activite, CreditActiviteData, SousActivite, SousSousActivite, TypeCredit } from '@/service/credit-activite.model';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-correction-demande',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        ButtonModule,
        InputGroupModule,
        RippleModule,
        MessageModule,
        ProgressSpinnerModule,
        DropdownModule,
        InputNumberModule,
        ToastModule,
        CalendarModule,
        RadioButtonModule,
        TableModule,
        DialogModule,
        DividerModule,
        CardModule,
        PanelModule,
        ChipModule
    ],
    templateUrl: './correction-demande.component.html',
    styleUrls: ['./correction-demande.component.scss'],
    providers: [MessageService]
})
export class CorrectionDemandeComponent implements OnInit {
    demandeIndividuelId!: number;
    today: Date = new Date();

    // Activites cascade
    typesCredit: TypeCredit[] = CreditActiviteData.TYPES_CREDIT;
    activites: Activite[] = CreditActiviteData.ACTIVITES;
    sousActivites: SousActivite[] = [];
    sousSousActivites: SousSousActivite[] = [];

    selectedActivite: Activite | null = null;
    selectedSousActivite: SousActivite | null = null;
    selectedSousSousActivite: SousSousActivite | null = null;
    selectedTypeCredit: TypeCredit | null = null;
    selectedAgence: Agence | null = null;

    // FormData
    formData: Partial<DemandeIndividuel> & {
        email?: string;
        dateAdhesion?: Date | null;
        sigle?: string;
        titreDirecteur?: string;
        numeroDemande?: string;
        numeroCredit?: string;
        prefectureActivite?: string;
        sousPrefectureActivite?: string;
        selectedTypeActivite?: number;
        selectedSousActivite?: number;
        selectedSousSousActivite?: number;
    } = {};

    // State
    state = signal<{
        typeCreditos?: TypeCreditDto[];
        allDelegations?: Delegation[];
        allAgences?: Agence[];
        allPointsVente?: PointVente[];
        filteredAgences?: Agence[];
        filteredPointsVente?: PointVente[];
        loading: boolean;
        submitting: boolean;
        message?: string;
        error?: any;
        garanties: GarantiePropose[];
        showGarantieDialog: boolean;
        currentGarantie: GarantiePropose;
        editingGarantieIndex?: number;
        // Rejection info from DA
        motifRejetDa?: string;
        sectionsARevoirDa?: string;
        instructionsAc?: string;
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
        currentGarantie: this.createEmptyGarantie(),
        editingGarantieIndex: undefined
    });

    // Dropdown options
    natureClientOptions = [
        { label: 'Demande credit Pour Particulier', value: 'Demande credit Pour Particulier' },
        { label: 'Demande de Credit Pour PME/PMI', value: 'Demande de Credit Pour PME/PMI' },
        { label: 'Demande de credit Pour Professionnels', value: 'Demande de credit Pour Professionnels' }
    ];

    activiteOptions: { label: string; value: number; data: Activite }[] = [];
    sousActiviteOptions: { label: string; value: number; data: SousActivite }[] = [];
    sousSousActiviteOptions: { label: string; value: number; data: SousSousActivite }[] = [];
    typeCreditOptions: { label: string; value: number; data: TypeCredit }[] = [];

    typePieceOptions = [
        { label: "Carte nationale d'identite", value: "Carte nationale d'identite" },
        { label: "Carte d'identite Biometrique", value: "Carte d'identite Biometrique" },
        { label: "Possession d'etat", value: "Possession d'etat" },
        { label: "Carte d'identite personnelle", value: "Carte d'identite personnelle" },
        { label: 'Passeport', value: 'Passeport' }
    ];

    genreOptions = [
        { label: 'Masculin', value: 'Masculin' },
        { label: 'Feminin', value: 'Feminin' }
    ];

    situationMatrimonialeOptions = [
        { label: 'Celebataire', value: 'Celebataire' },
        { label: 'Marie(e)', value: 'Marie' },
        { label: 'Fiance(e)', value: 'Fiance' },
        { label: 'Divorce(e)', value: 'Divorce' },
        { label: 'Veuf(ve)', value: 'Veuf' }
    ];

    typeProprieteOptions = [
        { label: 'Proprietaire', value: 'Proprietaire' },
        { label: 'Locataire', value: 'Locataire' },
        { label: 'Heberge', value: 'Heberge' }
    ];

    periodiciteOptions = [
        { label: 'Mensuelle', value: 'Mensuelle' },
        { label: 'Bimestrielle', value: 'Bimestrielle' },
        { label: 'Trimestrielle', value: 'Trimestrielle' },
        { label: 'Quatrimestrielle', value: 'Quatrimestrielle' },
        { label: 'Semestrielle', value: 'Semestrielle' },
        { label: 'Annuelle', value: 'Annuelle' }
    ];

    objectCreditOptions = [
        { label: 'Fond de roulement', value: 'Fond de roulement' },
        { label: 'Investissement', value: 'Investissement' },
        { label: 'Invest+Fond de Roulement', value: 'Invest+Fond de Roulement' },
        { label: 'Bon de Commande', value: 'Bon de Commande' }
    ];

    statutCreditOptions = [
        { label: 'Nouveau', value: 'Nouveau' },
        { label: 'Renouvellement', value: 'Renouvellement' }
    ];

    typeGarantieOptions = [
        { label: 'Caution Solidaire', value: 'Caution Solidaire' },
        { label: 'Garantie Financiere', value: 'Garantie Financiere' },
        { label: 'Garantie Materielle', value: 'Garantie Materielle' },
        { label: 'Autre Garantie', value: 'Autre Garantie' }
    ];

    // Injected services
    public router = inject(Router);
    private route = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);
    private creditService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.demandeIndividuelId = Number(this.route.snapshot.paramMap.get('demandeIndividuelId'));
        this.initializeOptions();
        this.loadInitialData();
    }

    // ======================== INITIALISATION ========================

    private initializeOptions(): void {
        this.typeCreditOptions = this.typesCredit.map((tc) => ({
            label: tc.des_TIP_CREDITO,
            value: tc.tip_CREDITO,
            data: tc
        }));

        this.activiteOptions = this.activites.map((a) => ({
            label: a.libelle,
            value: a.code,
            data: a
        }));
    }

    private loadInitialData(): void {
        this.state.update((s) => ({ ...s, loading: true }));

        // Load delegations/agences/PV first
        this.creditService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data) {
                        this.state.update((s) => ({
                            ...s,
                            allDelegations: response.data.delegations || [],
                            allAgences: response.data.agences || [],
                            allPointsVente: response.data.pointVentes || [],
                            typeCreditos: response.data.typeCreditos || []
                        }));
                    }
                    // Now load the demand data
                    this.loadDemandeData();
                },
                error: (error) => {
                    console.error('Error loading initial data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les donnees initiales',
                        life: 3000
                    });
                    this.state.update((s) => ({ ...s, loading: false }));
                }
            });
    }

    private loadDemandeData(): void {
        this.creditService
            .getDemandeWithGaranties$(this.demandeIndividuelId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    const demande = response.data?.demandeIndividuel;
                    if (!demande) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Demande introuvable',
                            life: 5000
                        });
                        this.state.update((s) => ({ ...s, loading: false }));
                        return;
                    }

                    // Store rejection info
                    this.state.update((s) => ({
                        ...s,
                        motifRejetDa: demande.motifRejetDa,
                        sectionsARevoirDa: demande.sectionsARevoirDa,
                        instructionsAc: demande.instructionsAc
                    }));

                    // Populate form
                    this.populateForm(demande);

                    // Load garanties
                    const garanties = (demande.garanties || []).map((g: GarantiePropose) => ({
                        ...g,
                        valeurEmprunte: g.valeurEmprunte || (g.typeGarantie === 'Autre Garantie' ? g.valeurGarantie : (g.valeurGarantie || 0) * 0.75)
                    }));

                    this.state.update((s) => ({
                        ...s,
                        garanties,
                        loading: false
                    }));
                },
                error: (error) => {
                    console.error('Error loading demande:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger la demande',
                        life: 5000
                    });
                    this.state.update((s) => ({ ...s, loading: false }));
                }
            });
    }

    private populateForm(demande: any): void {
        // Find delegation/agence/PV objects from loaded lists
        const allDelegations = this.state().allDelegations || [];
        const allAgences = this.state().allAgences || [];
        const allPointsVente = this.state().allPointsVente || [];

        const delegation = allDelegations.find((d: any) => d.id === demande.delegation) || undefined;
        const agence = allAgences.find((a: any) => a.id === demande.agence) || undefined;
        const pos = allPointsVente.find((p: any) => p.id === demande.pos) || undefined;

        // Set up filtered lists for cascade
        if (delegation) {
            const filteredAgences = allAgences.filter((a: any) => {
                const agenceDelegationId = a.delegation_id || a.delegationId || (a as any).delegation?.id || a.idDelegation;
                return agenceDelegationId === (delegation as any).id;
            });
            this.state.update((s) => ({ ...s, filteredAgences }));

            if (agence) {
                this.selectedAgence = agence;
                const filteredPointsVente = allPointsVente.filter((pv: any) => {
                    const pvAgenceId = pv.agence_id || pv.agenceId || (pv as any).agence?.id || pv.idAgence;
                    return pvAgenceId === (agence as any).id;
                });
                this.state.update((s) => ({ ...s, filteredPointsVente }));
            }
        }

        // Parse date
        let dateNaissance: Date | undefined;
        if (demande.dateNaissance) {
            dateNaissance = new Date(demande.dateNaissance);
        }

        // Populate formData
        this.formData = {
            nom: demande.nom || '',
            prenom: demande.prenom || '',
            sernom: demande.sernom || '',
            telephone: demande.telephone || '',
            numeroMembre: demande.numeroMembre || '',
            delegation: delegation as any,
            agence: agence as any,
            pos: pos as any,
            prefecture: demande.prefecture || '',
            sousPrefecture: demande.sousPrefecture || '',
            natureClient: demande.natureClient || 'Demande credit Pour Particulier',
            nomPersonneMorale: demande.nomPersonneMorale || '',
            sigle: demande.sigle || '',
            titreDirecteur: demande.titreDirecteur || '',
            typePiece: demande.typePiece || "Carte nationale d'identite",
            numId: demande.numId || '',
            dateNaissance: dateNaissance,
            lieuxNaissance: demande.lieuxNaissance || '',
            genre: demande.genre || 'Masculin',
            situationMatrimoniale: demande.situationMatrimoniale || 'Celebataire',
            nombrePersonneEnCharge: demande.nombrePersonneEnCharge || 0,
            nombrePersonneScolarise: demande.nombrePersonneScolarise || 0,
            nomPere: demande.nomPere || '',
            nomMere: demande.nomMere || '',
            nomConjoint: demande.nomConjoint || '',
            addresseDomicileContact: demande.addresseDomicileContact || '',
            typePropriete: demande.typePropriete || '',
            nombreAnneeHabitation: demande.nombreAnneeHabitation || 0,
            categorie: demande.categorie || '',
            typeActivite: demande.typeActivite || '',
            sousActivite: demande.sousActivite || '',
            sousSousActivite: demande.sousSousActivite || '',
            selectedTypeActivite: demande.typeActivite ? Number(demande.typeActivite) : undefined,
            selectedSousActivite: demande.sousActivite ? Number(demande.sousActivite) : undefined,
            selectedSousSousActivite: demande.sousSousActivite ? Number(demande.sousSousActivite) : undefined,
            descriptionActivite: demande.descriptionActivite || '',
            nombreAnneeActivite: demande.nombreAnneeActivite || 0,
            adresseLieuActivite: demande.adresseLieuActivite || '',
            autreActivite: demande.autreActivite || '',
            lieuActivite: demande.lieuActivite || '',
            natureActivite: demande.natureActivite || '',
            currentActivite: demande.currentActivite || '',
            profession: demande.profession || '',
            secteurActivite: demande.secteurActivite || '',
            prefectureActivite: demande.prefectureActivite || '',
            sousPrefectureActivite: demande.sousPrefectureActivite || '',
            montantDemande: demande.montantDemande || 0,
            dureeDemande: demande.dureeDemande || 12,
            periodiciteRemboursement: demande.periodiciteRemboursement || 'Mensuelle',
            tauxInteret: demande.tauxInteret || 3,
            periodeDiffere: demande.periodeDiffere || 0,
            nombreEcheance: demande.nombreEcheance || 12,
            echeance: demande.echeance || 0,
            objectCredit: demande.objectCredit || 'Fond de roulement',
            detailObjectCredit: demande.detailObjectCredit || '',
            statutCredit: demande.statutCredit || 'Nouveau',
            rangCredit: demande.rangCredit || 1,
            tipCredito: demande.tipCredito,
            email: demande.email || '',
            dateAdhesion: null
        };

        // Restore activity cascade selections
        if (this.formData.selectedTypeActivite) {
            this.selectedActivite = CreditActiviteData.getActiviteByCode(this.formData.selectedTypeActivite) || null;
            if (this.selectedActivite) {
                this.sousActivites = CreditActiviteData.getSousActivitesByActivite(this.formData.selectedTypeActivite);
                this.sousActiviteOptions = this.sousActivites.map((sa) => ({
                    label: sa.libelle,
                    value: sa.code,
                    data: sa
                }));

                if (this.formData.selectedSousActivite) {
                    this.selectedSousActivite = this.sousActivites.find((sa) => sa.code === this.formData.selectedSousActivite) || null;
                    if (this.selectedSousActivite) {
                        this.sousSousActivites = CreditActiviteData.getSousSousActivites(this.formData.selectedTypeActivite, this.formData.selectedSousActivite);
                        this.sousSousActiviteOptions = this.sousSousActivites.map((ssa) => ({
                            label: ssa.libelle,
                            value: ssa.code,
                            data: ssa
                        }));

                        if (this.formData.selectedSousSousActivite) {
                            this.selectedSousSousActivite = this.sousSousActivites.find((ssa) => ssa.code === this.formData.selectedSousSousActivite) || null;
                        }
                    }
                }
            }
        }

        // Restore type credit selection
        if (this.formData.tipCredito) {
            this.selectedTypeCredit = this.typesCredit.find((tc) => tc.tip_CREDITO === this.formData.tipCredito) || null;
        }
    }

    // ======================== NATURE CLIENT ========================

    onNatureClientChange(event: any): void {
        const natureClient = event.value;
        if (natureClient !== 'Demande de Credit Pour PME/PMI') {
            this.formData.nomPersonneMorale = '';
            this.formData.sigle = '';
            this.formData.titreDirecteur = '';
        }
        if (natureClient !== 'Demande credit Pour Particulier') {
            this.formData.profession = '';
            this.formData.secteurActivite = '';
        }
        if (natureClient === 'Demande credit Pour Particulier') {
            this.formData.natureActivite = '';
            this.formData.categorie = '';
            this.resetActiviteSelections();
        }
        this.formData.natureClient = natureClient;
    }

    isPME(): boolean {
        return this.formData.natureClient === 'Demande de Credit Pour PME/PMI';
    }

    isParticulier(): boolean {
        return this.formData.natureClient === 'Demande credit Pour Particulier';
    }

    // ======================== CASCADE: DELEGATION -> AGENCE -> PV ========================

    onDelegationChange(event: any): void {
        const delegation = event.value;
        this.formData.agence = undefined;
        this.formData.pos = undefined;
        this.selectedAgence = null;

        if (!delegation || !delegation.id) {
            this.state.update((s) => ({ ...s, filteredAgences: [], filteredPointsVente: [] }));
            return;
        }

        const allAgences = this.state().allAgences || [];
        const filteredAgences = allAgences.filter((agence: any) => {
            const agenceDelegationId = agence.delegation_id || agence.delegationId || agence.delegation?.id || agence.idDelegation;
            return agenceDelegationId === delegation.id;
        });
        this.state.update((s) => ({ ...s, filteredAgences, filteredPointsVente: [] }));
    }

    onAgenceChange(event: any): void {
        const agence = event.value;
        this.formData.pos = undefined;

        if (!agence || !agence.id) {
            this.selectedAgence = null;
            this.state.update((s) => ({ ...s, filteredPointsVente: [] }));
            return;
        }

        this.selectedAgence = agence;
        const allPointsVente = this.state().allPointsVente || [];
        const filteredPointsVente = allPointsVente.filter((pv: any) => {
            const pvAgenceId = pv.agence_id || pv.agenceId || pv.agence?.id || pv.idAgence;
            return pvAgenceId === agence.id;
        });
        this.state.update((s) => ({ ...s, filteredPointsVente }));
    }

    // ======================== CASCADE: ACTIVITE -> SOUS-ACTIVITE -> FILIERE ========================

    onActiviteChange(event: any): void {
        const codeActivite = event.value as number;
        this.formData.selectedSousActivite = undefined;
        this.formData.selectedSousSousActivite = undefined;
        this.formData.sousActivite = '';
        this.formData.sousSousActivite = '';
        this.selectedSousActivite = null;
        this.selectedSousSousActivite = null;
        this.sousActiviteOptions = [];
        this.sousSousActiviteOptions = [];
        this.sousActivites = [];
        this.sousSousActivites = [];

        if (!codeActivite) {
            this.selectedActivite = null;
            this.formData.selectedTypeActivite = undefined;
            this.formData.typeActivite = '';
            return;
        }

        this.formData.selectedTypeActivite = codeActivite;
        this.formData.typeActivite = codeActivite.toString();
        this.selectedActivite = CreditActiviteData.getActiviteByCode(codeActivite) || null;

        if (this.selectedActivite) {
            this.sousActivites = CreditActiviteData.getSousActivitesByActivite(codeActivite);
            this.sousActiviteOptions = this.sousActivites.map((sa) => ({
                label: sa.libelle,
                value: sa.code,
                data: sa
            }));
        }
    }

    onSousActiviteChange(event: any): void {
        const codeSousActivite = event.value as number;
        this.formData.selectedSousSousActivite = undefined;
        this.formData.sousSousActivite = '';
        this.selectedSousSousActivite = null;
        this.sousSousActiviteOptions = [];
        this.sousSousActivites = [];

        if (!codeSousActivite || !this.selectedActivite) {
            this.selectedSousActivite = null;
            this.formData.selectedSousActivite = undefined;
            this.formData.sousActivite = '';
            return;
        }

        this.formData.selectedSousActivite = codeSousActivite;
        this.formData.sousActivite = codeSousActivite.toString();
        this.selectedSousActivite = this.sousActivites.find((sa) => sa.code === codeSousActivite) || null;

        if (this.selectedSousActivite && this.selectedActivite) {
            this.sousSousActivites = CreditActiviteData.getSousSousActivites(this.selectedActivite.code, codeSousActivite);
            this.sousSousActiviteOptions = this.sousSousActivites.map((ssa) => ({
                label: ssa.libelle,
                value: ssa.code,
                data: ssa
            }));
        }
    }

    onSousSousActiviteChange(event: any): void {
        const codeSousSousActivite = event.value as number;
        if (!codeSousSousActivite) {
            this.selectedSousSousActivite = null;
            this.formData.selectedSousSousActivite = undefined;
            this.formData.sousSousActivite = '';
            return;
        }
        this.formData.selectedSousSousActivite = codeSousSousActivite;
        this.formData.sousSousActivite = codeSousSousActivite.toString();
        this.selectedSousSousActivite = this.sousSousActivites.find((ssa) => ssa.code === codeSousSousActivite) || null;
    }

    // ======================== TYPE DE CREDIT ========================

    onTypeCreditChange(event: any): void {
        const tipCredito = event.value;
        if (!tipCredito) {
            this.selectedTypeCredit = null;
            this.formData.tipCredito = undefined;
            return;
        }
        this.selectedTypeCredit = this.typesCredit.find((tc) => tc.tip_CREDITO === tipCredito) || null;
        this.formData.tipCredito = tipCredito;
    }

    // ======================== GESTION DES GARANTIES ========================

    createEmptyGarantie(): GarantiePropose {
        return {
            typeGarantie: 'Caution Solidaire',
            descriptionGarantie: '',
            valeurGarantie: 0
        };
    }

    showAddGarantieDialog(): void {
        this.state.update((s) => ({
            ...s,
            showGarantieDialog: true,
            currentGarantie: this.createEmptyGarantie(),
            editingGarantieIndex: undefined
        }));
    }

    editGarantie(garantie: GarantiePropose, index: number): void {
        this.state.update((s) => ({
            ...s,
            showGarantieDialog: true,
            currentGarantie: { ...garantie },
            editingGarantieIndex: index
        }));
    }

    saveGarantie(): void {
        const currentState = this.state();
        const garantie = currentState.currentGarantie;

        if (!garantie.typeGarantie || !garantie.descriptionGarantie || garantie.valeurGarantie <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs de la garantie',
                life: 3000
            });
            return;
        }

        garantie.valeurEmprunte = garantie.typeGarantie === 'Autre Garantie' ? garantie.valeurGarantie : garantie.valeurGarantie * 0.75;
        const garanties = [...currentState.garanties];

        if (currentState.editingGarantieIndex !== undefined) {
            garanties[currentState.editingGarantieIndex] = garantie;
        } else {
            garanties.push(garantie);
        }

        this.state.update((s) => ({
            ...s,
            garanties,
            showGarantieDialog: false,
            currentGarantie: this.createEmptyGarantie(),
            editingGarantieIndex: undefined
        }));
    }

    deleteGarantie(index: number): void {
        const garanties = this.state().garanties.filter((_, i) => i !== index);
        this.state.update((s) => ({ ...s, garanties }));
    }

    cancelGarantie(): void {
        this.state.update((s) => ({
            ...s,
            showGarantieDialog: false,
            currentGarantie: this.createEmptyGarantie(),
            editingGarantieIndex: undefined
        }));
    }

    calculateTotalGaranties(): number {
        return this.state().garanties.reduce((sum, g) => sum + (g.valeurGarantie || 0), 0);
    }

    calculateTotalEmpruntable(): number {
        return this.state().garanties.reduce((sum, g) => sum + (g.valeurEmprunte || 0), 0);
    }

    getGarantiesByType(...types: string[]): GarantiePropose[] {
        return this.state().garanties.filter((g) => types.includes(g.typeGarantie!));
    }

    deleteGarantieByRef(garantie: GarantiePropose): void {
        const index = this.state().garanties.indexOf(garantie);
        if (index > -1) {
            this.state.update((s) => ({
                ...s,
                garanties: s.garanties.filter((_, i) => i !== index)
            }));
            this.messageService.add({ severity: 'success', summary: 'Succes', detail: 'Garantie supprimee', life: 2000 });
        }
    }

    // ======================== SOUMISSION ========================

    submitCorrection(form: NgForm): void {
        if (form.invalid) {
            Object.keys(form.controls).forEach((key) => form.controls[key].markAsTouched());
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs obligatoires',
                life: 5000
            });
            return;
        }

        if (this.isPME() && (!this.formData.nomPersonneMorale || this.formData.nomPersonneMorale.trim() === '')) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Le nom de l'entreprise est obligatoire pour une demande PME/PMI",
                life: 5000
            });
            return;
        }

        if (this.state().garanties.length === 0) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez ajouter au moins une garantie',
                life: 5000
            });
            return;
        }

        this.state.update((s) => ({ ...s, submitting: true }));

        const delegationValue = this.formData.delegation as any;
        const agenceValue = this.formData.agence as any;
        const posValue = this.formData.pos as any;

        const demandeData: DemandeIndividuel = {
            ...this.formData,
            ...form.value,
            demandeIndividuelId: this.demandeIndividuelId,
            delegation: delegationValue?.id || delegationValue,
            agence: agenceValue?.id || agenceValue,
            pos: posValue?.id || posValue,
            natureClient: this.formData.natureClient || 'Demande credit Pour Particulier',
            nomPersonneMorale: this.isPME() ? this.formData.nomPersonneMorale : '',
            sigle: this.isPME() ? this.formData.sigle : '',
            sernom: this.formData.sernom || '',
            categorie: this.isParticulier() ? '' : this.formData.categorie || '',
            natureActivite: this.isParticulier() ? '' : this.formData.natureActivite || '',
            typeActivite: this.isParticulier() ? '' : this.formData.typeActivite || '',
            sousActivite: this.isParticulier() ? '' : this.formData.sousActivite || '',
            sousSousActivite: this.isParticulier() ? '' : this.formData.sousSousActivite || '',
            profession: this.isParticulier() ? this.formData.profession || '' : '',
            secteurActivite: this.isParticulier() ? this.formData.secteurActivite || '' : '',
            nomPere: this.formData.nomPere || '',
            nomMere: this.formData.nomMere || '',
            nomConjoint: this.formData.nomConjoint || '',
            prefecture: this.formData.prefecture || '',
            sousPrefecture: this.formData.sousPrefecture || '',
            email: this.formData.email || '',
            tipCredito: this.formData.tipCredito,
            descriptionActivite: this.getDescriptionActiviteComplete() || form.value.descriptionActivite,
            garanties: this.state().garanties.map((g) => ({
                ...g,
                typeGarantie: this.convertTypeGarantie(g.typeGarantie!)
            })),
            currentActivite: this.getActiviteLibelle(),
            codUsuarios: ''
        } as DemandeIndividuel;

        this.creditService
            .updateDemandeComplete$(this.demandeIndividuelId, demandeData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succes',
                        detail: 'Demande corrigee avec succes',
                        life: 5000
                    });
                    this.state.update((s) => ({ ...s, submitting: false }));
                    setTimeout(() => this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]), 2000);
                },
                error: (error) => {
                    console.error('Erreur:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || 'Echec de la mise a jour',
                        life: 7000
                    });
                    this.state.update((s) => ({ ...s, submitting: false }));
                }
            });
    }

    // ======================== UTILITAIRES ========================

    private convertTypeGarantie(type: string): string {
        const conversions: { [key: string]: string } = {
            'Depot a terme': 'Garantie Financiere',
            'Surete Reelles': 'Garantie Materielle'
        };
        return conversions[type] || type;
    }

    private getDescriptionActiviteComplete(): string {
        let description = '';
        if (this.selectedActivite) description = this.selectedActivite.libelle;
        if (this.selectedSousActivite) description += ' - ' + this.selectedSousActivite.libelle;
        if (this.selectedSousSousActivite) description += ' - ' + this.selectedSousSousActivite.libelle;
        return description;
    }

    private getActiviteLibelle(): string {
        return this.selectedActivite ? this.selectedActivite.libelle : '';
    }

    resetActiviteSelections(): void {
        this.selectedActivite = null;
        this.selectedSousActivite = null;
        this.selectedSousSousActivite = null;
        this.sousActivites = [];
        this.sousSousActivites = [];
        this.sousActiviteOptions = [];
        this.sousSousActiviteOptions = [];
        this.formData.typeActivite = '';
        this.formData.sousActivite = '';
        this.formData.sousSousActivite = '';
        this.formData.selectedTypeActivite = undefined;
        this.formData.selectedSousActivite = undefined;
        this.formData.selectedSousSousActivite = undefined;
    }

    goBack(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
    }
}
