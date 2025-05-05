import { UserService } from '@/service/user.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { DemandeCredititCompleteDTO } from '@/interface/demandeCredititComplete';
import { IResponse } from '@/interface/response';
import { TextareaModule } from 'primeng/textarea';
import { InputGroupModule } from 'primeng/inputgroup';
import { TagModule } from 'primeng/tag';
import { BadgeModule } from 'primeng/badge';
import { ListboxModule } from 'primeng/listbox';
import { AccordionModule } from 'primeng/accordion';
import { TableModule } from 'primeng/table';
import { PanelModule } from 'primeng/panel';

// D'après les définitions de types de PrimeNG (v14+)
type PrimeSeverity = 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast';

@Component({
    selector: 'app-step-credit',
    imports: [
        CommonModule,
        TextareaModule,
        InputGroupModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CalendarModule,
        DropdownModule,
        StepsModule,
        CardModule,
        ToastModule,
        TagModule,
        BadgeModule,
        ListboxModule,
        AccordionModule,
        CurrencyPipe,
        TableModule,
        PanelModule
    ],
    templateUrl: './step-credit.component.html',
    providers: [MessageService]
})
export class StepCreditComponent {
    // Injection des services
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private analyseCreditService = inject(UserService);

    // Définition des variables
    activeIndex = signal<number>(0);
    items = signal<MenuItem[]>([]);
    loading = signal<boolean>(false);

    // Formulaires pour chaque étape
    infoBaseForm!: FormGroup;
    bilanEntrepriseForm!: FormGroup;
    bilanPersonnelForm!: FormGroup;
    resultatActuelForm!: FormGroup;
    resultatPrevisionnelForm!: FormGroup;
    chargesActuellesForm!: FormGroup;
    chargesPrevisionellesForm!: FormGroup;
    demandeCreditForm!: FormGroup;

    // Données pour les formulaires
    formeJuridiques = [
        { label: 'SARL', value: 'SARL' },
        { label: 'SA', value: 'SA' },
        { label: 'EI', value: 'EI' },
        { label: 'EIRL', value: 'EIRL' },
        { label: 'SNC', value: 'SNC' }
    ];

    secteursActivite = [
        { label: 'Commerce', value: 'Commerce' },
        { label: 'Agriculture', value: 'Agriculture' },
        { label: 'Service', value: 'Service' },
        { label: 'Industrie', value: 'Industrie' },
        { label: 'Artisanat', value: 'Artisanat' }
    ];

    // Résumé des informations saisies
    resumeData: any = {};
    // Déclarer les propriétés avec leur type

    ngOnInit() {
        this.initStepItems();
        this.initForms();
    }

    // Initialisation des étapes du stepper
    initStepItems() {
        this.items.set([
            { label: 'Informations de base', command: () => this.onStepChange(0) },
            { label: 'Bilan entreprise', command: () => this.onStepChange(1) },
            { label: 'Bilan personnel', command: () => this.onStepChange(2) },
            { label: 'Résultats actuels', command: () => this.onStepChange(3) },
            { label: 'Résultats prévisionnels', command: () => this.onStepChange(4) },
            { label: 'Charges actuelles', command: () => this.onStepChange(5) },
            { label: 'Charges prévisionnelles', command: () => this.onStepChange(6) },
            { label: 'Demande de crédit', command: () => this.onStepChange(7) },
            { label: 'Résumé', command: () => this.onStepChange(8) }
        ]);
    }

    // Initialisation des formulaires pour chaque étape
    initForms() {
        // Formulaire pour les informations de base (promoteur et entreprise)
        this.infoBaseForm = this.fb.group({
            // Promoteur
            nomPromoteur: ['', Validators.required],
            prenomPromoteur: ['', Validators.required],
            dateNaissance: [null],
            numeroIdentite: [''],
            adressePromoteur: [''],
            telephonePromoteur: [''],
            emailPromoteur: ['', Validators.email],

            // Entreprise
            nomEntreprise: ['', Validators.required],
            formeJuridique: [''],
            secteurActivite: [''],
            dateCreation: [null],
            numeroRegistre: [''],
            adresseEntreprise: [''],
            telephoneEntreprise: [''],
            emailEntreprise: ['', Validators.email]
        });

        // Formulaire pour le bilan de l'entreprise
        this.bilanEntrepriseForm = this.fb.group({
            liquidites: [0, Validators.min(0)],
            creancesClients: [0, Validators.min(0)],
            valeurStocks: [0, Validators.min(0)],
            valeurEquipements: [0, Validators.min(0)],
            dettesFournisseurs: [0, Validators.min(0)],
            emprunts: [0, Validators.min(0)],
            capitalPropre: [0, Validators.min(0)]
        });

        // Formulaire pour le bilan personnel du promoteur
        this.bilanPersonnelForm = this.fb.group({
            epargnes: [0, Validators.min(0)],
            valeurBiensDurables: [0, Validators.min(0)]
        });

        // Formulaire pour les résultats actuels
        this.resultatActuelForm = this.fb.group({
            chiffreAffaires: [0, [Validators.required, Validators.min(0)]],
            coutMarchandises: [0, [Validators.required, Validators.min(0)]]
        });

        // Formulaire pour les résultats prévisionnels
        this.resultatPrevisionnelForm = this.fb.group({
            chiffreAffaires: [0, [Validators.required, Validators.min(0)]],
            coutMarchandises: [0, [Validators.required, Validators.min(0)]]
        });

        // Formulaire pour les charges actuelles
        this.chargesActuellesForm = this.fb.group({
            coutTransportProduction: [0, Validators.min(0)],
            fraisTransportPersonnel: [0, Validators.min(0)],
            fraisManutention: [0, Validators.min(0)],
            montantAideExterne: [0, Validators.min(0)],
            fraisHebergementRestauration: [0, Validators.min(0)],
            impots: [0, Validators.min(0)],
            loyers: [0, Validators.min(0)]
        });

        // Formulaire pour les charges prévisionnelles
        this.chargesPrevisionellesForm = this.fb.group({
            coutTransportProduction: [0, Validators.min(0)],
            fraisTransportPersonnel: [0, Validators.min(0)],
            fraisManutention: [0, Validators.min(0)],
            montantAideExterne: [0, Validators.min(0)],
            fraisHebergementRestauration: [0, Validators.min(0)],
            impots: [0, Validators.min(0)],
            loyers: [0, Validators.min(0)]
        });

        // Formulaire pour la demande de crédit
        this.demandeCreditForm = this.fb.group({
            montantDemande: [0, [Validators.required, Validators.min(1)]],
            dureeMois: [12, [Validators.required, Validators.min(1)]],
            objetFinancement: ['', Validators.required]
        });
    }

    onStepChange(index: number) {
        if (!this.validateCurrentForm()) {
            return;
        }

        if (index === 8) {
            this.prepareSummary();
        }

        this.activeIndex.set(index);
    }

    // Navigation entre les étapes
    nextStep() {
        const currentIndex = this.activeIndex();

        if (!this.validateCurrentForm()) {
            return;
        }

        if (currentIndex < this.items().length - 1) {
            if (currentIndex === 7) {
                this.prepareSummary();
            }
            this.activeIndex.set(currentIndex + 1);
        }
    }

    prevStep() {
        const currentIndex = this.activeIndex();
        if (currentIndex > 0) {
            this.activeIndex.set(currentIndex - 1);
        }
    }

    // Validation du formulaire actuel
    validateCurrentForm(): boolean {
        const currentIndex = this.activeIndex();

        switch (currentIndex) {
            case 0: // Informations de base
                if (this.infoBaseForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs obligatoires.' });
                    return false;
                }
                this.saveInfoBaseToResume();
                break;
            case 1: // Bilan entreprise
                if (this.bilanEntrepriseForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs du bilan.' });
                    return false;
                }
                this.saveBilanEntrepriseToResume();
                break;
            case 2: // Bilan personnel
                if (this.bilanPersonnelForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs du bilan personnel.' });
                    return false;
                }
                this.saveBilanPersonnelToResume();
                break;
            case 3: // Résultats actuels
                if (this.resultatActuelForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs des résultats actuels.' });
                    return false;
                }
                this.saveResultatActuelToResume();
                break;
            case 4: // Résultats prévisionnels
                if (this.resultatPrevisionnelForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs des résultats prévisionnels.' });
                    return false;
                }
                this.saveResultatPrevisionnelToResume();
                break;
            case 5: // Charges actuelles
                if (this.chargesActuellesForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs des charges actuelles.' });
                    return false;
                }
                this.saveChargesActuellesToResume();
                break;
            case 6: // Charges prévisionnelles
                if (this.chargesPrevisionellesForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs des charges prévisionnelles.' });
                    return false;
                }
                this.saveChargesPrevisionellesToResume();
                break;
            case 7: // Demande de crédit
                if (this.demandeCreditForm.invalid) {
                    this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir correctement tous les champs de la demande de crédit.' });
                    return false;
                }
                this.saveDemandeCreditToResume();
                break;
        }

        return true;
    }

    // Méthodes pour sauvegarder les données dans l'objet résumé
    saveInfoBaseToResume() {
        // Extraire la valeur du label pour forme juridique
        const formeJuridiqueValue = this.infoBaseForm.get('formeJuridique')?.value;
        const formeJuridiqueLabel = formeJuridiqueValue
            ? (typeof formeJuridiqueValue === 'object' && formeJuridiqueValue.label ? formeJuridiqueValue.label : this.formeJuridiques.find((f) => f.value === formeJuridiqueValue)?.label) || formeJuridiqueValue || ''
            : '';

        // Extraire la valeur du label pour secteur d'activité
        const secteurActiviteValue = this.infoBaseForm.get('secteurActivite')?.value;
        const secteurActiviteLabel = secteurActiviteValue
            ? (typeof secteurActiviteValue === 'object' && secteurActiviteValue.label ? secteurActiviteValue.label : this.secteursActivite.find((s) => s.value === secteurActiviteValue)?.label) || secteurActiviteValue || ''
            : '';

        this.resumeData.promoteur = {
            nom: this.infoBaseForm.get('nomPromoteur')?.value || '',
            prenom: this.infoBaseForm.get('prenomPromoteur')?.value || '',
            date_naissance: this.formatDate(this.infoBaseForm.get('dateNaissance')?.value),
            numero_identite: this.infoBaseForm.get('numeroIdentite')?.value || '',
            adresse: this.infoBaseForm.get('adressePromoteur')?.value || '',
            telephone: this.infoBaseForm.get('telephonePromoteur')?.value || '',
            email: this.infoBaseForm.get('emailPromoteur')?.value || ''
        };

        this.resumeData.entreprise = {
            nom: this.infoBaseForm.get('nomEntreprise')?.value || '',
            forme_juridique: formeJuridiqueLabel,
            secteur_activite: secteurActiviteLabel,
            date_creation: this.formatDate(this.infoBaseForm.get('dateCreation')?.value),
            numero_registre: this.infoBaseForm.get('numeroRegistre')?.value || '',
            adresse: this.infoBaseForm.get('adresseEntreprise')?.value || '',
            telephone: this.infoBaseForm.get('telephoneEntreprise')?.value || '',
            email: this.infoBaseForm.get('emailEntreprise')?.value || ''
        };
    }

    saveBilanEntrepriseToResume() {
        this.resumeData.bilanEntreprise = {
            liquidites: this.bilanEntrepriseForm.get('liquidites')?.value || 0,
            creances_clients: this.bilanEntrepriseForm.get('creancesClients')?.value || 0,
            valeur_stocks: this.bilanEntrepriseForm.get('valeurStocks')?.value || 0,
            valeur_equipements: this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0,
            dettes_fournisseurs: this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0,
            emprunts: this.bilanEntrepriseForm.get('emprunts')?.value || 0,
            capital_propre: this.bilanEntrepriseForm.get('capitalPropre')?.value || 0
        };
    }

    saveBilanPersonnelToResume() {
        this.resumeData.bilanPersonnel = {
            epargnes: this.bilanPersonnelForm.get('epargnes')?.value || 0,
            valeur_biens_durables: this.bilanPersonnelForm.get('valeurBiensDurables')?.value || 0
        };
    }

    saveResultatActuelToResume() {
        this.resumeData.resultatActuel = {
            chiffre_affaires: this.resultatActuelForm.get('chiffreAffaires')?.value || 0,
            cout_marchandises: this.resultatActuelForm.get('coutMarchandises')?.value || 0
        };
    }

    saveResultatPrevisionnelToResume() {
        this.resumeData.resultatPrevisionnel = {
            chiffre_affaires: this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0,
            cout_marchandises: this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0
        };
    }

    saveChargesActuellesToResume() {
        this.resumeData.chargesActuelles = {
            cout_transport_production: this.chargesActuellesForm.get('coutTransportProduction')?.value || 0,
            frais_transport_personnel: this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0,
            frais_manutention: this.chargesActuellesForm.get('fraisManutention')?.value || 0,
            montant_aide_externe: this.chargesActuellesForm.get('montantAideExterne')?.value || 0,
            frais_hebergement_restauration: this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0,
            impots: this.chargesActuellesForm.get('impots')?.value || 0,
            loyers: this.chargesActuellesForm.get('loyers')?.value || 0
        };
    }

    saveChargesPrevisionellesToResume() {
        this.resumeData.chargesPrevisionnelles = {
            cout_transport_production: this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0,
            frais_transport_personnel: this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0,
            frais_manutention: this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0,
            montant_aide_externe: this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0,
            frais_hebergement_restauration: this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0,
            impots: this.chargesPrevisionellesForm.get('impots')?.value || 0,
            loyers: this.chargesPrevisionellesForm.get('loyers')?.value || 0
        };
    }

    saveDemandeCreditToResume() {
        this.resumeData.demandeCredit = {
            montant_demande: this.demandeCreditForm.get('montantDemande')?.value || 0,
            duree_mois: this.demandeCreditForm.get('dureeMois')?.value || 0,
            objet_financement: this.demandeCreditForm.get('objetFinancement')?.value || ''
        };
    }

    prepareSummary() {
        // S'assurer que toutes les données sont bien dans le résumé
        this.saveInfoBaseToResume();
        this.saveBilanEntrepriseToResume();
        this.saveBilanPersonnelToResume();
        this.saveResultatActuelToResume();
        this.saveResultatPrevisionnelToResume();
        this.saveChargesActuellesToResume();
        this.saveChargesPrevisionellesToResume();
        this.saveDemandeCreditToResume();
    }

    finaliserDemande() {
        this.loading.set(true);

        // Création de l'objet DTO pour la demande complète
        const demandeComplete: DemandeCredititCompleteDTO = {
            // Données du promoteur
            nomPromoteur: this.infoBaseForm.get('nomPromoteur')?.value || '',
            prenomPromoteur: this.infoBaseForm.get('prenomPromoteur')?.value || '',
            dateNaissancePromoteur: this.formatDate(this.infoBaseForm.get('dateNaissance')?.value),
            numeroIdentitePromoteur: this.infoBaseForm.get('numeroIdentite')?.value || '',
            adressePromoteur: this.infoBaseForm.get('adressePromoteur')?.value || '',
            telephonePromoteur: this.infoBaseForm.get('telephonePromoteur')?.value || '',
            emailPromoteur: this.infoBaseForm.get('emailPromoteur')?.value || '',

            // Données de l'entreprise
            nomEntreprise: this.infoBaseForm.get('nomEntreprise')?.value || '',
            formeJuridique: this.getFormeJuridiqueValue(),
            secteurActivite: this.getSecteurActiviteValue(),
            dateCreationEntreprise: this.formatDate(this.infoBaseForm.get('dateCreation')?.value),
            numeroRegistre: this.infoBaseForm.get('numeroRegistre')?.value || '',
            adresseEntreprise: this.infoBaseForm.get('adresseEntreprise')?.value || '',
            telephoneEntreprise: this.infoBaseForm.get('telephoneEntreprise')?.value || '',
            emailEntreprise: this.infoBaseForm.get('emailEntreprise')?.value || '',

            // Bilan de l'entreprise
            liquidites: this.bilanEntrepriseForm.get('liquidites')?.value || 0,
            creancesClients: this.bilanEntrepriseForm.get('creancesClients')?.value || 0,
            valeurStocks: this.bilanEntrepriseForm.get('valeurStocks')?.value || 0,
            valeurEquipements: this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0,
            dettesFournisseurs: this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0,
            emprunts: this.bilanEntrepriseForm.get('emprunts')?.value || 0,
            capitalPropre: this.bilanEntrepriseForm.get('capitalPropre')?.value || 0,

            // Bilan personnel
            epargnes: this.bilanPersonnelForm.get('epargnes')?.value || 0,
            valeurBiensDurables: this.bilanPersonnelForm.get('valeurBiensDurables')?.value || 0,

            // Dates pour le compte d'exploitation actuel (année précédente)
            dateDebutPeriodeActuel: this.formatDate(new Date(new Date().getFullYear() - 1, 0, 1)),
            dateFinPeriodeActuel: this.formatDate(new Date(new Date().getFullYear() - 1, 11, 31)),

            // Résultats actuels + charges actuelles
            chiffreAffairesActuel: this.resultatActuelForm.get('chiffreAffaires')?.value || 0,
            coutMarchandisesActuel: this.resultatActuelForm.get('coutMarchandises')?.value || 0,
            coutTransportProductionActuel: this.chargesActuellesForm.get('coutTransportProduction')?.value || 0,
            fraisTransportPersonnelActuel: this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0,
            fraisManutentionActuel: this.chargesActuellesForm.get('fraisManutention')?.value || 0,
            montantAideExterneActuel: this.chargesActuellesForm.get('montantAideExterne')?.value || 0,
            fraisHebergementRestaurationActuel: this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0,
            impotsActuel: this.chargesActuellesForm.get('impots')?.value || 0,
            loyersActuel: this.chargesActuellesForm.get('loyers')?.value || 0,

            // Dates pour le compte d'exploitation prévisionnel (année en cours)
            dateDebutPeriodePrevisionnel: this.formatDate(new Date(new Date().getFullYear(), 0, 1)),
            dateFinPeriodePrevisionnel: this.formatDate(new Date(new Date().getFullYear(), 11, 31)),

            // Résultats prévisionnels + charges prévisionnelles
            chiffreAffairesPrevisionnel: this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0,
            coutMarchandisesPrevisionnel: this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0,
            coutTransportProductionPrevisionnel: this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0,
            fraisTransportPersonnelPrevisionnel: this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0,
            fraisManutentionPrevisionnel: this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0,
            montantAideExternePrevisionnel: this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0,
            fraisHebergementRestaurationPrevisionnel: this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0,
            impotsPrevisionnel: this.chargesPrevisionellesForm.get('impots')?.value || 0,
            loyersPrevisionnel: this.chargesPrevisionellesForm.get('loyers')?.value || 0,

            // Demande de crédit
            montantDemande: this.demandeCreditForm.get('montantDemande')?.value || 0,
            dureeMois: this.demandeCreditForm.get('dureeMois')?.value || 0,
            objetFinancement: this.demandeCreditForm.get('objetFinancement')?.value || ''
        };

        // Appel à l'API pour soumettre la demande complète
        this.analyseCreditService
            .submitCompleteDemande$(demandeComplete)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.loading.set(false);

                    if (response) {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Votre demande de crédit a été soumise avec succès!'
                        });

                        // Redirection vers une page de confirmation ou la liste des demandes
                        setTimeout(() => {
                            this.router.navigate([``]);
                        }, 2000);
                    } else {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erreur',
                            detail: 'Erreur lors de la soumission de la demande complète.'
                        });
                    }
                },
                error: (error) => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors de la soumission de la demande complète.'
                    });
                    console.error('Erreur lors de la soumission de la demande complète:', error);
                }
            });
    }

    // Méthodes de calcul financier

    calculerTotalActif(): number {
        const liquidites = this.bilanEntrepriseForm.get('liquidites')?.value || 0;
        const creancesClients = this.bilanEntrepriseForm.get('creancesClients')?.value || 0;
        const valeurStocks = this.bilanEntrepriseForm.get('valeurStocks')?.value || 0;
        const valeurEquipements = this.bilanEntrepriseForm.get('valeurEquipements')?.value || 0;

        return liquidites + creancesClients + valeurStocks + valeurEquipements;
    }

    calculerTotalPassif(): number {
        const dettesFournisseurs = this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0;
        const emprunts = this.bilanEntrepriseForm.get('emprunts')?.value || 0;
        const capitalPropre = this.bilanEntrepriseForm.get('capitalPropre')?.value || 0;

        return dettesFournisseurs + emprunts + capitalPropre;
    }

    calculerRatioLiquidite(): number {
        const liquidites = this.bilanEntrepriseForm.get('liquidites')?.value || 0;
        const dettesFournisseurs = this.bilanEntrepriseForm.get('dettesFournisseurs')?.value || 0;
        const emprunts = this.bilanEntrepriseForm.get('emprunts')?.value || 0;

        const totalDettes = dettesFournisseurs + emprunts;

        return totalDettes > 0 ? liquidites / totalDettes : 0;
    }

    calculerMargeButeActuelle(): number {
        const chiffreAffaires = this.resultatActuelForm.get('chiffreAffaires')?.value || 0;
        const coutMarchandises = this.resultatActuelForm.get('coutMarchandises')?.value || 0;

        return chiffreAffaires > 0 ? (chiffreAffaires - coutMarchandises) / chiffreAffaires : 0;
    }

    calculerMargeButePrevisionnelle(): number {
        const chiffreAffaires = this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0;
        const coutMarchandises = this.resultatPrevisionnelForm.get('coutMarchandises')?.value || 0;

        return chiffreAffaires > 0 ? (chiffreAffaires - coutMarchandises) / chiffreAffaires : 0;
    }

    // Méthodes utilitaires pour extraire les valeurs correctes
    getFormeJuridiqueValue(): string {
        const value = this.infoBaseForm.get('formeJuridique')?.value;
        if (!value) return '';

        if (typeof value === 'object' && value.value) {
            return value.value;
        }

        return value;
    }

    getSecteurActiviteValue(): string {
        const value = this.infoBaseForm.get('secteurActivite')?.value;
        if (!value) return '';

        if (typeof value === 'object' && value.value) {
            return value.value;
        }

        return value;
    }

    // Méthode pour calculer la mensualité
    calculerMensualite(): number {
        const montant = this.demandeCreditForm.get('montantDemande')?.value || 0;
        const duree = this.demandeCreditForm.get('dureeMois')?.value || 1;
        return montant / duree;
    }

    // Méthode pour formater les dates pour l'affichage
    formatDateForDisplay(date: Date | string | null): string {
        if (!date) return '';

        if (typeof date === 'string') {
            // Essayer de convertir la chaîne en Date
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toLocaleDateString('fr-FR');
            }
            return date;
        }

        if (date instanceof Date) {
            return date.toLocaleDateString('fr-FR');
        }

        return '';
    }

    formatDate(date: Date | string | null): string {
        if (!date) return '';

        if (typeof date === 'string') {
            const parsedDate = new Date(date);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate.toLocaleDateString('fr-FR');
            }
            return date;
        }

        if (date instanceof Date) {
            return date.toLocaleDateString('fr-FR');
        }

        return '';
    }

    // Méthode pour calculer le total des charges actuelles
    calculerTotalChargesActuelles(): number {
        const coutTransportProduction = this.chargesActuellesForm.get('coutTransportProduction')?.value || 0;
        const fraisTransportPersonnel = this.chargesActuellesForm.get('fraisTransportPersonnel')?.value || 0;
        const fraisManutention = this.chargesActuellesForm.get('fraisManutention')?.value || 0;
        const montantAideExterne = this.chargesActuellesForm.get('montantAideExterne')?.value || 0;
        const fraisHebergementRestauration = this.chargesActuellesForm.get('fraisHebergementRestauration')?.value || 0;
        const impots = this.chargesActuellesForm.get('impots')?.value || 0;
        const loyers = this.chargesActuellesForm.get('loyers')?.value || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    // Méthode pour calculer le total des charges prévisionnelles
    calculerTotalChargesPrevisionnelles(): number {
        const coutTransportProduction = this.chargesPrevisionellesForm.get('coutTransportProduction')?.value || 0;
        const fraisTransportPersonnel = this.chargesPrevisionellesForm.get('fraisTransportPersonnel')?.value || 0;
        const fraisManutention = this.chargesPrevisionellesForm.get('fraisManutention')?.value || 0;
        const montantAideExterne = this.chargesPrevisionellesForm.get('montantAideExterne')?.value || 0;
        const fraisHebergementRestauration = this.chargesPrevisionellesForm.get('fraisHebergementRestauration')?.value || 0;
        const impots = this.chargesPrevisionellesForm.get('impots')?.value || 0;
        const loyers = this.chargesPrevisionellesForm.get('loyers')?.value || 0;

        return coutTransportProduction + fraisTransportPersonnel + fraisManutention + montantAideExterne + fraisHebergementRestauration + impots + loyers;
    }

    // Méthode pour calculer le ratio crédit/CA prévisionnel
    calculerRatioCreditCA(): number {
        const montantDemande = this.demandeCreditForm.get('montantDemande')?.value || 0;
        const chiffreAffairesPrevisionnel = this.resultatPrevisionnelForm.get('chiffreAffaires')?.value || 0;

        return chiffreAffairesPrevisionnel > 0 ? montantDemande / chiffreAffairesPrevisionnel : 0;
    }

    // Méthode pour obtenir la sévérité du ratio crédit/CA
    getRatioCreditCASeverity(): PrimeSeverity {
        const ratio = this.calculerRatioCreditCA();

        if (ratio <= 0.5) return 'success';
        if (ratio <= 1) return 'info';
        if (ratio <= 1.5) return 'warn';
        return 'danger';
    }

    // Méthode pour déterminer la sévérité (couleur) en fonction de la marge
    getMarginSeverity(margin: number): PrimeSeverity {
        if (margin >= 0.4) return 'success';
        if (margin >= 0.25) return 'info';
        if (margin >= 0.15) return 'warn';
        return 'danger';
    }

    // Méthode pour déterminer la sévérité (couleur) en fonction du ratio de liquidité
    getLiquiditySeverity(ratio: number): PrimeSeverity {
        if (ratio > 2) return 'success';
        if (ratio > 1.2) return 'info';
        if (ratio > 0.8) return 'warn';
        return 'danger';
    }
}
