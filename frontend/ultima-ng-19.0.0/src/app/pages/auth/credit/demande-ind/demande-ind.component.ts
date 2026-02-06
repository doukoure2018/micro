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
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { PanelModule } from 'primeng/panel';
import { PasswordModule } from 'primeng/password';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-demande-ind',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        InputTextModule,
        TextareaModule,
        FileUploadModule,
        ButtonModule,
        InputGroupModule,
        RippleModule,
        MessageModule,
        ProgressSpinnerModule,
        PasswordModule,
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
    templateUrl: './demande-ind.component.html',
    styleUrls: ['./demande-ind.component.scss'],
    providers: [MessageService]
})
export class DemandeIndComponent implements OnInit {
    // Propriétés existantes
    today: Date = new Date();
    currentUser: any = null;
    selectedAgence: Agence | null = null;

    // Propriétés pour les activités
    typesCredit: TypeCredit[] = CreditActiviteData.TYPES_CREDIT;
    activites: Activite[] = CreditActiviteData.ACTIVITES;
    sousActivites: SousActivite[] = [];
    sousSousActivites: SousSousActivite[] = [];

    // Sélections actuelles pour les dropdowns en cascade
    selectedActivite: Activite | null = null;
    selectedSousActivite: SousActivite | null = null;
    selectedSousSousActivite: SousSousActivite | null = null;
    selectedTypeCredit: TypeCredit | null = null;

    // FormData initialisé avec les valeurs par défaut
    formData: Partial<DemandeIndividuel> & {
        email?: string;
        dateAdhesion?: Date | null;
        sigle?: string;
        titreDirecteur?: string;
        numeroDemande?: string;
        numeroCredit?: string;
        prefectureActivite?: string;
        sousPrefectureActivite?: string;
        // Activités - utiliser number | undefined pour correspondre aux options dropdown
        selectedTypeActivite?: number;
        selectedSousActivite?: number;
        selectedSousSousActivite?: number;
    } = {
        // Informations de base
        nom: '',
        prenom: '',
        sernom: '',
        telephone: '',
        numeroMembre: '',

        // Localisation administrative - OBJETS pour les dropdowns
        delegation: undefined,
        agence: undefined,
        pos: undefined,
        prefecture: '',
        sousPrefecture: '',

        // Nature client
        natureClient: 'Demande credit Pour Particulier',
        nomPersonneMorale: '',
        sigle: '',
        titreDirecteur: '',

        // Informations personnelles
        typePiece: "Carte nationale d'identite",
        numId: '',
        dateNaissance: undefined,
        lieuxNaissance: '',
        genre: 'Masculin',
        situationMatrimoniale: 'Celebataire',
        nombrePersonneEnCharge: 0,
        nombrePersonneScolarise: 0,
        nomPere: '',
        nomMere: '',
        nomConjoint: '',
        addresseDomicileContact: '',
        typePropriete: '',
        nombreAnneeHabitation: 0,

        // Activité - codes numériques pour les dropdowns
        categorie: '',
        typeActivite: '',
        sousActivite: '',
        sousSousActivite: '',
        selectedTypeActivite: undefined,
        selectedSousActivite: undefined,
        selectedSousSousActivite: undefined,
        descriptionActivite: '',
        nombreAnneeActivite: 0,
        adresseLieuActivite: '',
        autreActivite: '',
        lieuActivite: '',
        natureActivite: '',
        currentActivite: '',
        profession: '',
        secteurActivite: '',
        prefectureActivite: '',
        sousPrefectureActivite: '',

        // Modalités de crédit
        montantDemande: 0,
        dureeDemande: 12,
        periodiciteRemboursement: 'Mensuelle',
        tauxInteret: 3,
        periodeDiffere: 0,
        nombreEcheance: 12,
        echeance: 0,
        objectCredit: 'Fond de roulement',
        detailObjectCredit: '',
        statutCredit: 'Nouveau',
        rangCredit: 1,
        tipCredito: undefined,

        // Système
        statutDemande: 'EN_ATTENTE',
        validationState: 'SELECTION',

        // Champs supplémentaires
        email: '',
        dateAdhesion: null,
        numeroDemande: '',
        numeroCredit: ''
    };

    // État du composant
    state = signal<{
        typeCreditos?: TypeCreditDto[];
        clientData?: any;
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
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined,
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

    // Options pour nature client
    natureClientOptions = [
        { label: 'Demande crédit Pour Particulier', value: 'Demande credit Pour Particulier' },
        { label: 'Demande de Crédit Pour PME/PMI', value: 'Demande de Credit Pour PME/PMI' },
        { label: 'Demande de crédit Pour Professionnels', value: 'Demande de credit Pour Professionnels' }
    ];

    // Options pour les dropdowns d'activités - value doit être number
    activiteOptions: { label: string; value: number; data: Activite }[] = [];
    sousActiviteOptions: { label: string; value: number; data: SousActivite }[] = [];
    sousSousActiviteOptions: { label: string; value: number; data: SousSousActivite }[] = [];
    typeCreditOptions: { label: string; value: number; data: TypeCredit }[] = [];

    typePieceOptions = [
        { label: "Carte nationale d'identité", value: "Carte nationale d'identite" },
        { label: "Carte d'identité Biométrique", value: "Carte d'identite Biometrique" },
        { label: "Possession d'état", value: "Possession d'état" },
        { label: "Carte d'identité personnelle", value: "Carte d'identite personnelle" },
        { label: 'Passeport', value: 'Passeport' }
    ];

    genreOptions = [
        { label: 'Masculin', value: 'Masculin' },
        { label: 'Féminin', value: 'Feminin' }
    ];

    situationMatrimonialeOptions = [
        { label: 'Célibataire', value: 'Celebataire' },
        { label: 'Marié(e)', value: 'Marie' },
        { label: 'Fiancé(e)', value: 'Fiance' },
        { label: 'Divorcé(e)', value: 'Divorce' },
        { label: 'Veuf(ve)', value: 'Veuf' }
    ];

    typeProprieteOptions = [
        { label: 'Propriétaire', value: 'Proprietaire' },
        { label: 'Locataire', value: 'Locataire' },
        { label: 'Hébergé', value: 'Heberge' }
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
        { label: 'Garantie Financière', value: 'Garantie Financiere' },
        { label: 'Garantie Matérielle', value: 'Garantie Materielle' },
        { label: 'Autre Garantie', value: 'Autre Garantie' }
    ];

    // Services injectés
    public router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private creditService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadInitialData();
        this.initializeOptions();
    }

    // ======================== GESTION NATURE CLIENT ========================

    onNatureClientChange(event: any): void {
        const natureClient = event.value;

        if (natureClient !== 'Demande de Credit Pour PME/PMI') {
            this.formData.nomPersonneMorale = '';
            this.formData.sigle = '';
            this.formData.titreDirecteur = '';
        }

        // Reset champs Particulier si on quitte Particulier
        if (natureClient !== 'Demande credit Pour Particulier') {
            this.formData.profession = '';
            this.formData.secteurActivite = '';
        }

        // Reset champs activite cascade si on passe a Particulier
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

    // ======================== INITIALISATION ========================

    private initializeOptions(): void {
        // Types de crédit
        this.typeCreditOptions = this.typesCredit.map((tc) => ({
            label: tc.des_TIP_CREDITO,
            value: tc.tip_CREDITO,
            data: tc
        }));

        // Activités - value est le code (number)
        this.activiteOptions = this.activites.map((a) => ({
            label: a.libelle,
            value: a.code,
            data: a
        }));

        console.log('Options initialisées:', {
            activites: this.activiteOptions,
            typesCredit: this.typeCreditOptions.length
        });
    }

    private loadInitialData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        this.creditService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data) {
                        const delegations = response.data.delegations || [];
                        const agences = response.data.agences || [];
                        const pointVentes = response.data.pointVentes || [];

                        console.log('Données chargées:', { delegations: delegations.length, agences: agences.length, pointVentes: pointVentes.length });

                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            allDelegations: delegations,
                            allAgences: agences,
                            allPointsVente: pointVentes,
                            typeCreditos: response.data.typeCreditos || []
                        }));
                    }
                },
                error: (error) => {
                    console.error('Error loading initial data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données initiales',
                        life: 3000
                    });
                    this.state.update((state) => ({ ...state, loading: false }));
                }
            });
    }

    // ======================== CASCADE: DÉLÉGATION → AGENCE → POINT DE SERVICE ========================

    onDelegationChange(event: any): void {
        const delegation = event.value;
        console.log('=== Délégation sélectionnée ===', delegation);

        // Reset agence et point de vente
        this.formData.agence = undefined;
        this.formData.pos = undefined;
        this.selectedAgence = null;

        if (!delegation || !delegation.id) {
            this.state.update((state) => ({ ...state, filteredAgences: [], filteredPointsVente: [] }));
            return;
        }

        const allAgences = this.state().allAgences || [];
        const filteredAgences = allAgences.filter((agence: any) => {
            const agenceDelegationId = agence.delegation_id || agence.delegationId || agence.delegation?.id || agence.idDelegation;
            return agenceDelegationId === delegation.id;
        });

        console.log('Agences filtrées:', filteredAgences.length);
        this.state.update((state) => ({ ...state, filteredAgences, filteredPointsVente: [] }));
    }

    onAgenceChange(event: any): void {
        const agence = event.value;
        console.log('=== Agence sélectionnée ===', agence);

        this.formData.pos = undefined;

        if (!agence || !agence.id) {
            this.selectedAgence = null;
            this.state.update((state) => ({ ...state, filteredPointsVente: [] }));
            return;
        }

        this.selectedAgence = agence;
        const allPointsVente = this.state().allPointsVente || [];
        const filteredPointsVente = allPointsVente.filter((pv: any) => {
            const pvAgenceId = pv.agence_id || pv.agenceId || pv.agence?.id || pv.idAgence;
            return pvAgenceId === agence.id;
        });

        console.log('Points de vente filtrés:', filteredPointsVente.length);
        this.state.update((state) => ({ ...state, filteredPointsVente }));
    }

    // ======================== CASCADE: ACTIVITÉ → SOUS-ACTIVITÉ → FILIÈRE ========================

    /**
     * Gère le changement d'activité - charge les sous-activités correspondantes
     */
    onActiviteChange(event: any): void {
        const codeActivite = event.value as number;
        console.log('=== Activité sélectionnée ===', 'code:', codeActivite, 'type:', typeof codeActivite);

        // Reset sous-activité et filière
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

        // Stocker le code
        this.formData.selectedTypeActivite = codeActivite;
        this.formData.typeActivite = codeActivite.toString();

        // Trouver l'activité par son code
        this.selectedActivite = CreditActiviteData.getActiviteByCode(codeActivite) || null;
        console.log('Activité trouvée:', this.selectedActivite);

        if (this.selectedActivite) {
            // Charger les sous-activités
            this.sousActivites = CreditActiviteData.getSousActivitesByActivite(codeActivite);
            console.log('Sous-activités trouvées:', this.sousActivites);

            this.sousActiviteOptions = this.sousActivites.map((sa) => ({
                label: sa.libelle,
                value: sa.code,
                data: sa
            }));
            console.log('Options sous-activités:', this.sousActiviteOptions);
        }
    }

    /**
     * Gère le changement de sous-activité - charge les filières
     */
    onSousActiviteChange(event: any): void {
        const codeSousActivite = event.value as number;
        console.log('=== Sous-activité sélectionnée ===', 'code:', codeSousActivite);

        // Reset filière
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

        // Stocker le code
        this.formData.selectedSousActivite = codeSousActivite;
        this.formData.sousActivite = codeSousActivite.toString();

        // Trouver la sous-activité
        this.selectedSousActivite = this.sousActivites.find((sa) => sa.code === codeSousActivite) || null;
        console.log('Sous-activité trouvée:', this.selectedSousActivite);

        if (this.selectedSousActivite && this.selectedActivite) {
            // Charger les filières (sous-sous-activités)
            this.sousSousActivites = CreditActiviteData.getSousSousActivites(this.selectedActivite.code, codeSousActivite);
            console.log('Filières trouvées:', this.sousSousActivites);

            this.sousSousActiviteOptions = this.sousSousActivites.map((ssa) => ({
                label: ssa.libelle,
                value: ssa.code,
                data: ssa
            }));
            console.log('Options filières:', this.sousSousActiviteOptions);
        }
    }

    /**
     * Gère le changement de filière
     */
    onSousSousActiviteChange(event: any): void {
        const codeSousSousActivite = event.value as number;
        console.log('=== Filière sélectionnée ===', 'code:', codeSousSousActivite);

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

    // ======================== TYPE DE CRÉDIT ========================

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
        this.state.update((state) => ({
            ...state,
            showGarantieDialog: true,
            currentGarantie: this.createEmptyGarantie(),
            editingGarantieIndex: undefined
        }));
    }

    editGarantie(garantie: GarantiePropose, index: number): void {
        this.state.update((state) => ({
            ...state,
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

        // Autre Garantie (ex: apport financier) => 100%, sinon 75%
        garantie.valeurEmprunte = garantie.typeGarantie === 'Autre Garantie' ? garantie.valeurGarantie : garantie.valeurGarantie * 0.75;
        const garanties = [...currentState.garanties];

        if (currentState.editingGarantieIndex !== undefined) {
            garanties[currentState.editingGarantieIndex] = garantie;
        } else {
            garanties.push(garantie);
        }

        this.state.update((state) => ({
            ...state,
            garanties,
            showGarantieDialog: false,
            currentGarantie: this.createEmptyGarantie(),
            editingGarantieIndex: undefined
        }));
    }

    deleteGarantie(index: number): void {
        const garanties = this.state().garanties.filter((_, i) => i !== index);
        this.state.update((state) => ({ ...state, garanties }));
    }

    cancelGarantie(): void {
        this.state.update((state) => ({
            ...state,
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
            this.state.update((state) => ({
                ...state,
                garanties: state.garanties.filter((_, i) => i !== index)
            }));
            this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Garantie supprimée', life: 2000 });
        }
    }

    // ======================== SOUMISSION DU FORMULAIRE ========================

    createDemande(form: NgForm): void {
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

        this.state.update((state) => ({ ...state, submitting: true }));

        const delegationValue = this.formData.delegation as any;
        const agenceValue = this.formData.agence as any;
        const posValue = this.formData.pos as any;

        const demandeData: DemandeIndividuel = {
            ...this.formData,
            ...form.value,
            delegation: delegationValue?.id || delegationValue,
            agence: agenceValue?.id || agenceValue,
            pos: posValue?.id || posValue,
            natureClient: this.formData.natureClient || 'Demande credit Pour Particulier',
            nomPersonneMorale: this.isPME() ? this.formData.nomPersonneMorale : '',
            sigle: this.isPME() ? this.formData.sigle : '',
            sernom: this.formData.sernom || '',
            // Champs activite: vides pour Particulier
            categorie: this.isParticulier() ? '' : this.formData.categorie || '',
            natureActivite: this.isParticulier() ? '' : this.formData.natureActivite || '',
            typeActivite: this.isParticulier() ? '' : this.formData.typeActivite || '',
            sousActivite: this.isParticulier() ? '' : this.formData.sousActivite || '',
            sousSousActivite: this.isParticulier() ? '' : this.formData.sousSousActivite || '',
            // Champs Particulier: vides pour PME/Professionnels
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
            statutDemande: 'EN_ATTENTE',
            validationState: 'NOUVEAU',
            currentActivite: this.getActiviteLibelle(),
            codUsuarios: ''
        } as DemandeIndividuel;

        console.log('Données de la demande:', demandeData);

        this.creditService
            .addDemandeIndWithGaranties$(demandeData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Réponse:', response);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Demande créée avec succès. ID: ${response.data?.demandeId || 'N/A'}`,
                        life: 5000
                    });
                    this.state.update((state) => ({ ...state, submitting: false, garanties: [], filteredAgences: [], filteredPointsVente: [] }));
                    form.resetForm();
                    this.resetForm();
                    setTimeout(() => this.router.navigate(['/']), 2000);
                },
                error: (error) => {
                    console.error('Erreur:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || error || 'Échec de la soumission',
                        life: 7000
                    });
                    this.state.update((state) => ({ ...state, submitting: false }));
                }
            });
    }

    // ======================== MÉTHODES UTILITAIRES ========================

    private convertTypeGarantie(type: string): string {
        const conversions: { [key: string]: string } = {
            'Dépôt à terme': 'Garantie Financiere',
            'Depot a terme': 'Garantie Financiere',
            'Sûretés Réelles': 'Garantie Materielle',
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

    private resetForm(): void {
        this.formData = this.getInitialFormData();
        this.resetActiviteSelections();
        this.selectedAgence = null;
    }

    private getInitialFormData(): Partial<DemandeIndividuel> & {
        email?: string;
        dateAdhesion?: Date | null;
        sigle?: string;
        titreDirecteur?: string;
        selectedTypeActivite?: number;
        selectedSousActivite?: number;
        selectedSousSousActivite?: number;
    } {
        return {
            nom: '',
            prenom: '',
            sernom: '',
            telephone: '',
            numeroMembre: '',
            typePiece: "Carte nationale d'identite",
            numId: '',
            dateNaissance: undefined,
            lieuxNaissance: '',
            genre: 'Masculin',
            situationMatrimoniale: 'Celebataire',
            nombrePersonneEnCharge: 0,
            nombrePersonneScolarise: 0,
            nomPere: '',
            nomMere: '',
            nomConjoint: '',
            addresseDomicileContact: '',
            typePropriete: '',
            nombreAnneeHabitation: 0,
            natureClient: 'Demande credit Pour Particulier',
            nomPersonneMorale: '',
            sigle: '',
            titreDirecteur: '',
            categorie: '',
            delegation: undefined,
            agence: undefined,
            pos: undefined,
            prefecture: '',
            sousPrefecture: '',
            typeActivite: '',
            sousActivite: '',
            sousSousActivite: '',
            selectedTypeActivite: undefined,
            selectedSousActivite: undefined,
            selectedSousSousActivite: undefined,
            descriptionActivite: '',
            nombreAnneeActivite: 0,
            adresseLieuActivite: '',
            autreActivite: '',
            lieuActivite: '',
            natureActivite: '',
            currentActivite: '',
            profession: '',
            secteurActivite: '',
            montantDemande: 0,
            dureeDemande: 12,
            periodiciteRemboursement: 'Mensuelle',
            tauxInteret: 3,
            periodeDiffere: 0,
            nombreEcheance: 12,
            echeance: 0,
            objectCredit: 'Fond de roulement',
            detailObjectCredit: '',
            statutCredit: 'Nouveau',
            rangCredit: 1,
            tipCredito: undefined,
            statutDemande: 'EN_ATTENTE',
            validationState: 'SELECTION',
            email: '',
            dateAdhesion: null
        };
    }
}
