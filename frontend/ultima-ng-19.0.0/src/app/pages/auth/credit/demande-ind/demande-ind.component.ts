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
import { FileUploadModule } from 'primeng/fileupload';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText, InputTextModule } from 'primeng/inputtext';
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
    // Propriétés manquantes ajoutées
    today: Date = new Date();
    currentUser: any = null;
    selectedAgence: Agence | null = null;

    // Nouvelles propriétés pour les activités
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
    formData: Partial<DemandeIndividuel> = {
        nom: '',
        prenom: '',
        telephone: '',
        numeroMembre: '',
        typePiece: "Carte nationale d'identite" as any,
        numId: '',
        dateNaissance: undefined,
        lieuxNaissance: '',
        genre: 'Masculin' as any,
        situationMatrimoniale: 'Celebataire' as any,
        nombrePersonneEnCharge: 0,
        nombrePersonneScolarise: 0,
        addresseDomicileContact: '',
        typePropriete: '',
        nombreAnneeHabitation: 0,
        natureClient: 'Individuel',
        delegation: 0,
        agence: 0,
        pos: 0,
        typeActivite: '',
        sousActivite: '',
        sousSousActivite: '',
        descriptionActivite: '',
        nombreAnneeActivite: 0,
        adresseLieuActivite: '',
        autreActivite: '',
        lieuActivite: '',
        currentActivite: '',
        montantDemande: 0,
        dureeDemande: 0,
        periodiciteRemboursement: 'Mensuelle' as any,
        tauxInteret: 0,
        periodeDiffere: 0,
        nombreEcheance: 0,
        echeance: 0,
        objectCredit: 'Fond de roulement' as any,
        detailObjectCredit: '',
        statutCredit: 'Nouveau' as any,
        rangCredit: 1,
        tipCredito: 0,
        statutDemande: 'EN_ATTENTE',
        validationState: 'NOUVEAU'
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

    // Options pour nature client - NOUVEAU
    natureClientOptions = [
        { label: 'Individuel', value: 'Individuel', icon: 'pi pi-user' },
        { label: 'PME', value: 'PME', icon: 'pi pi-building' },
        { label: 'Groupe Solidaire', value: 'Groupe Solidaire', icon: 'pi pi-users' },
        { label: 'Autre', value: 'Autre', icon: 'pi pi-question-circle' }
    ];
    // Options modifiées pour les dropdowns
    activiteOptions: any[] = [];
    sousActiviteOptions: any[] = [];
    sousSousActiviteOptions: any[] = [];
    typeCreditOptions: any[] = [];

    // Options pour les dropdowns
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
        { label: 'Garantie Financière', value: 'Garantie Financiere' }, // Changé
        { label: 'Garantie Matérielle', value: 'Garantie Materielle' }, // Changé
        { label: 'Autre Garantie', value: 'Autre Garantie' }
    ];

    // Services injectés
    public router = inject(Router);
    private activatedRoute = inject(ActivatedRoute);
    private destroyRef = inject(DestroyRef);
    private creditService = inject(UserService);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.loadInitialData();
        this.initializeOptions();

        this.activatedRoute.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const codeClient = params['codeClient'];
            if (codeClient) {
                this.loadClientData(codeClient);
            }
        });
    }

    // Nouvelle méthode pour gérer le changement de nature client
    onNatureClientChange(event: any): void {
        const natureClient = event.value;

        // Adapter certains champs en fonction de la nature du client
        if (natureClient === 'PME') {
            // Pour les PME, on pourrait adapter certains libellés ou validations
            this.messageService.add({
                severity: 'info',
                summary: 'Information',
                detail: 'Formulaire adapté pour les PME',
                life: 3000
            });
        } else if (natureClient === 'Groupe Solidaire') {
            // Pour les groupes solidaires, informer l'utilisateur
            this.messageService.add({
                severity: 'info',
                summary: 'Information',
                detail: 'Pour un groupe solidaire, veuillez renseigner le représentant du groupe',
                life: 5000
            });
        }

        this.formData.natureClient = natureClient;
    }

    /**
     * Initialiser les options des dropdowns
     */
    private initializeOptions(): void {
        // Types de crédit
        this.typeCreditOptions = this.typesCredit.map((tc) => ({
            label: tc.des_TIP_CREDITO,
            value: tc.tip_CREDITO,
            data: tc
        }));

        // Activités
        this.activiteOptions = this.activites.map((a) => ({
            label: a.libelle,
            value: a.code,
            data: a
        }));
    }

    /**
     * Gérer le changement d'activité
     */
    onActiviteChange(event: any): void {
        const codeActivite = event.value;

        if (!codeActivite) {
            // Réinitialiser les sous-activités et sous-sous-activités
            this.sousActivites = [];
            this.sousSousActivites = [];
            this.sousActiviteOptions = [];
            this.sousSousActiviteOptions = [];
            this.selectedActivite = null;
            this.selectedSousActivite = null;
            this.selectedSousSousActivite = null;
            this.formData.sousActivite = '';
            this.formData.sousSousActivite = '';
            return;
        }

        // Trouver l'activité sélectionnée
        this.selectedActivite = CreditActiviteData.getActiviteByCode(codeActivite) || null;

        // Charger les sous-activités correspondantes
        this.sousActivites = CreditActiviteData.getSousActivitesByActivite(codeActivite);
        this.sousActiviteOptions = this.sousActivites.map((sa) => ({
            label: sa.libelle,
            value: sa.code,
            data: sa
        }));

        // Réinitialiser les sous-sous-activités
        this.sousSousActivites = [];
        this.sousSousActiviteOptions = [];
        this.selectedSousActivite = null;
        this.selectedSousSousActivite = null;
        this.formData.sousActivite = '';
        this.formData.sousSousActivite = '';

        // Mettre à jour le formData avec le code
        this.formData.typeActivite = codeActivite.toString();
    }

    /**
     * Gérer le changement de sous-activité
     */
    onSousActiviteChange(event: any): void {
        const codeSousActivite = event.value;

        if (!codeSousActivite || !this.selectedActivite) {
            this.sousSousActivites = [];
            this.sousSousActiviteOptions = [];
            this.selectedSousActivite = null;
            this.selectedSousSousActivite = null;
            this.formData.sousSousActivite = '';
            return;
        }

        // Trouver la sous-activité sélectionnée
        this.selectedSousActivite = CreditActiviteData.getSousActiviteByCode(this.selectedActivite.code, codeSousActivite) || null;

        // Charger les sous-sous-activités correspondantes
        this.sousSousActivites = CreditActiviteData.getSousSousActivites(this.selectedActivite.code, codeSousActivite);

        this.sousSousActiviteOptions = this.sousSousActivites.map((ssa) => ({
            label: ssa.libelle,
            value: ssa.code,
            data: ssa
        }));

        // Réinitialiser la sous-sous-activité
        this.selectedSousSousActivite = null;
        this.formData.sousSousActivite = '';

        // Mettre à jour le formData avec le code
        this.formData.sousActivite = codeSousActivite.toString();
    }

    /**
     * Gérer le changement de sous-sous-activité
     */
    onSousSousActiviteChange(event: any): void {
        const codeSousSousActivite = event.value;

        if (!codeSousSousActivite) {
            this.selectedSousSousActivite = null;
            this.formData.sousSousActivite = '';
            return;
        }

        // Trouver la sous-sous-activité sélectionnée
        this.selectedSousSousActivite = this.sousSousActivites.find((ssa) => ssa.code === codeSousSousActivite) || null;

        // Mettre à jour le formData avec le code
        this.formData.sousSousActivite = codeSousSousActivite.toString();
    }

    /**
     * Gérer le changement de type de crédit
     */
    onTypeCreditChange(event: any): void {
        const tipCredito = event.value;

        if (!tipCredito) {
            this.selectedTypeCredit = null;
            this.formData.tipCredito = 0;
            return;
        }

        // Trouver le type de crédit sélectionné
        this.selectedTypeCredit = CreditActiviteData.getTypeCreditById(tipCredito) || null;

        // Mettre à jour le formData
        this.formData.tipCredito = tipCredito;
    }

    private loadInitialData(): void {
        this.state.update((state) => ({ ...state, loading: true }));

        this.creditService
            .startNewDemandeInd$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data) {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            allDelegations: response.data.delegations || [],
                            allAgences: response.data.agences || [],
                            allPointsVente: response.data.pointVentes || [],
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

    private loadClientData(codeClient: string): void {
        this.creditService
            .searchClientes$(codeClient)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data && response.data.clientes) {
                        this.state.update((state) => ({
                            ...state,
                            clientData: response.data.clientes
                        }));

                        // Pré-remplir le numéro membre si disponible
                        if (response.data.clientes.clientesPKId?.codCliente) {
                            this.formData.numeroMembre = response.data.clientes.clientesPKId.codCliente;
                        }
                    }
                },
                error: (error) => {
                    console.error('Error loading client data:', error);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données du client',
                        life: 3000
                    });
                }
            });
    }

    onDelegationChange(event: any): void {
        const delegation = event.value;
        if (!delegation || !delegation.id) {
            this.state.update((state) => ({
                ...state,
                filteredAgences: [],
                filteredPointsVente: []
            }));
            this.selectedAgence = null;
            return;
        }

        const filteredAgences = this.state().allAgences?.filter((agence) => agence.delegation_id === delegation.id) || [];

        this.state.update((state) => ({
            ...state,
            filteredAgences,
            filteredPointsVente: []
        }));
        this.selectedAgence = null;
    }

    onAgenceChange(event: any): void {
        const agence = event.value;
        if (!agence || !agence.id) {
            this.state.update((state) => ({
                ...state,
                filteredPointsVente: []
            }));
            this.selectedAgence = null;
            return;
        }

        this.selectedAgence = agence;
        const filteredPointsVente = this.state().allPointsVente?.filter((pv) => pv.agence_id === agence.id) || [];

        this.state.update((state) => ({
            ...state,
            filteredPointsVente
        }));
    }

    // Gestion des garanties
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

        // Calculer la valeur empruntable (75%)
        garantie.valeurEmprunte = garantie.valeurGarantie * 0.75;

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
        return this.state().garanties.reduce((sum, g) => sum + g.valeurGarantie, 0);
    }

    calculateTotalEmpruntable(): number {
        return this.state().garanties.reduce((sum, g) => sum + (g.valeurEmprunte || 0), 0);
    }

    // Calcul de l'échéance
    // calculateEcheance(form: NgForm): void {
    //     const montant = form.value.montantDemande || this.formData.montantDemande;
    //     const duree = form.value.dureeDemande || this.formData.dureeDemande;
    //     const taux = form.value.tauxInteret || this.formData.tauxInteret;

    //     if (montant && duree && taux) {
    //         const tauxMensuel = taux / 100 / 12;
    //         const echeance = (montant * tauxMensuel) / (1 - Math.pow(1 + tauxMensuel, -duree));
    //         this.formData.echeance = Math.round(echeance * 100) / 100;

    //         // Mettre à jour le contrôle du formulaire si disponible
    //         if (form.controls && form.controls['echeance']) {
    //             form.controls['echeance'].setValue(this.formData.echeance);
    //         }
    //     }
    // }

    // Soumission du formulaire
    createDemande(form: NgForm): void {
        if (form.invalid) {
            Object.keys(form.controls).forEach((key) => {
                form.controls[key].markAsTouched();
            });

            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs obligatoires',
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

        // Préparer les données avec natureClient
        const demandeData: DemandeIndividuel = {
            ...this.formData,
            ...form.value,
            // Extraire les IDs des objets sélectionnés
            delegation: form.value.delegation?.id || this.formData.delegation,
            agence: form.value.agence?.id || this.formData.agence,
            pos: form.value.pos?.id || this.formData.pos,

            // Nature du client
            natureClient: this.formData.natureClient || 'Individuel', // NOUVEAU

            // Activités
            typeActivite: this.selectedActivite ? this.selectedActivite.code.toString() : this.formData.typeActivite,
            sousActivite: this.selectedSousActivite ? this.selectedSousActivite.code.toString() : this.formData.sousActivite,
            sousSousActivite: this.selectedSousSousActivite ? this.selectedSousSousActivite.code.toString() : '',

            // Type de crédit
            tipCredito: this.selectedTypeCredit ? this.selectedTypeCredit.tip_CREDITO : this.formData.tipCredito,

            // Description de l'activité
            descriptionActivite: this.getDescriptionActiviteComplete() || form.value.descriptionActivite,

            // Garanties avec les nouveaux types
            garanties: this.state().garanties.map((g) => ({
                ...g,
                // Conversion des anciens types si nécessaire
                typeGarantie: this.convertTypeGarantie(g.typeGarantie!)
            })),

            // Valeurs par défaut
            statutDemande: 'EN_ATTENTE',
            validationState: 'NOUVEAU',
            currentActivite: this.getActiviteLibelle(),
            //createdAt: new Date().toISOString(),
            codUsuarios: ''
        } as DemandeIndividuel;

        console.log('Données de la demande à envoyer:', demandeData);

        this.creditService
            .addDemandeIndWithGaranties$(demandeData)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Réponse du serveur:', response);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `Demande de crédit créée avec succès. ID: ${response.data?.demandeId || 'N/A'}`,
                        life: 5000
                    });

                    this.state.update((state) => ({
                        ...state,
                        submitting: false,
                        garanties: [],
                        filteredAgences: [],
                        filteredPointsVente: []
                    }));

                    form.resetForm();
                    this.formData = this.getInitialFormData();

                    setTimeout(() => {
                        this.router.navigate(['/demandes']);
                    }, 2000);
                },
                error: (error) => {
                    console.error('Erreur lors de la création de la demande:', error);

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.message || error || 'Échec de la soumission de la demande',
                        life: 7000
                    });

                    this.state.update((state) => ({ ...state, submitting: false }));
                }
            });
    }

    private convertTypeGarantie(type: string): string {
        const conversions: { [key: string]: string } = {
            'Dépôt à terme': 'Garantie Financiere',
            'Depot a terme': 'Garantie Financiere',
            'Sûretés Réelles': 'Garantie Materielle',
            'Surete Reelles': 'Garantie Materielle'
        };
        return conversions[type] || type;
    }

    /**
     * Obtenir la description complète de l'activité
     */
    private getDescriptionActiviteComplete(): string {
        let description = '';

        if (this.selectedActivite) {
            description = this.selectedActivite.libelle;
        }

        if (this.selectedSousActivite) {
            description += ' - ' + this.selectedSousActivite.libelle;
        }

        if (this.selectedSousSousActivite) {
            description += ' - ' + this.selectedSousSousActivite.libelle;
        }

        return description;
    }

    /**
     * Obtenir le libellé de l'activité principale
     */
    private getActiviteLibelle(): string {
        return this.selectedActivite ? this.selectedActivite.libelle : '';
    }

    // Méthode pour réinitialiser les sélections d'activité
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
    }

    // Méthode pour obtenir les valeurs initiales du formulaire
    private getInitialFormData(): Partial<DemandeIndividuel> {
        return {
            nom: '',
            prenom: '',
            telephone: '',
            numeroMembre: '',
            typePiece: "Carte nationale d'identite" as any,
            numId: '',
            dateNaissance: undefined,
            lieuxNaissance: '',
            genre: 'Masculin' as any,
            situationMatrimoniale: 'Celebataire' as any,
            nombrePersonneEnCharge: 0,
            nombrePersonneScolarise: 0,
            addresseDomicileContact: '',
            typePropriete: '',
            nombreAnneeHabitation: 0,
            natureClient: 'Individuel',
            delegation: 0,
            agence: 0,
            pos: 0,
            typeActivite: '',
            sousActivite: '',
            sousSousActivite: '',
            descriptionActivite: '',
            nombreAnneeActivite: 0,
            adresseLieuActivite: '',
            autreActivite: '',
            lieuActivite: '',
            currentActivite: '',
            montantDemande: 0,
            dureeDemande: 0,
            periodiciteRemboursement: 'Mensuelle' as any,
            tauxInteret: 0,
            periodeDiffere: 0,
            nombreEcheance: 0,
            echeance: 0,
            objectCredit: 'Fond de roulement' as any,
            detailObjectCredit: '',
            statutCredit: 'Nouveau' as any,
            rangCredit: 1,
            tipCredito: 0,
            statutDemande: 'EN_ATTENTE',
            validationState: 'NOUVEAU'
        };
    }
}
