import { IUser } from '@/interface/user';
import { Component, Input, inject, signal, computed, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// PrimeNG Imports
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { FloatLabelModule } from 'primeng/floatlabel';
import { JavaDatePipe } from '@/pipes/java-date.pipe';
import { UserService } from '@/service/user.service';
import { InfoPersonnelDto } from '@/interface/info.personnel';
import { AvanceSalaireDto } from '@/interface/salary';
import { DemandeSalaryDto } from '@/interface/demande.salary';
import { AuthorizeSalaireDto } from '@/interface/authorize-salaire.dto';
import { Router } from '@angular/router';

@Component({
    selector: 'app-demande-avance-salaire',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        JavaDatePipe,
        CardModule,
        InputTextModule,
        InputNumberModule,
        ButtonModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        DividerModule,
        ProgressSpinnerModule,
        TagModule,
        TooltipModule,
        StepsModule,
        FloatLabelModule
    ],
    providers: [MessageService],
    templateUrl: './demande-avance-salaire.component.html',
    styleUrl: './demande-avance-salaire.component.scss'
})
export class DemandeAvanceSalaireComponent implements OnInit {
    @Input() user?: IUser;

    private salaireService = inject(UserService);
    private router = inject(Router);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);
    private cdr = inject(ChangeDetectorRef);

    // ==================== SIGNALS ====================

    // Autorisation
    isCheckingAuthorization = signal<boolean>(true);
    isAuthorized = signal<boolean>(false);
    authorizationMessage = signal<string>("Les demandes d'avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.");

    // ✅ NOUVEAU: Gestion du matricule manquant
    hasMatriculeInAccount = signal<boolean>(true); // L'utilisateur a-t-il un matricule dans son compte?
    needsManualMatricule = signal<boolean>(false); // Doit-on demander le matricule manuellement?
    isSearchingMatricule = signal<boolean>(false); // Recherche manuelle en cours?
    matriculeSearchError = signal<string>(''); // Erreur de recherche matricule

    isSearching = signal<boolean>(false);
    isSubmitting = signal<boolean>(false);
    isLoadingDemandes = signal<boolean>(false);

    personnelInfo = signal<InfoPersonnelDto | null>(null);
    avanceInfo = signal<AvanceSalaireDto | null>(null);
    demandesActives = signal<DemandeSalaryDto[]>([]);
    searchError = signal<string>('');
    currentStep = signal<number>(0);

    formAmount = signal<number>(0);
    formNumeroCompte = signal<string>('');

    // ✅ NOUVEAU: Matricule saisi manuellement
    manualMatricule = signal<string>('');

    // ==================== FORMULAIRES ====================

    searchForm: FormGroup = this.fb.group({
        matricule: ['', [Validators.required, Validators.minLength(1)]]
    });

    demandeForm: FormGroup = this.fb.group({
        amount: [null, [Validators.required, Validators.min(1)]],
        numeroCompte: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11), Validators.pattern(/^\d{11}$/)]]
    });

    // ==================== COMPUTED ====================

    matricule = computed(() => this.personnelInfo()?.matricule || this.manualMatricule() || '');

    nomComplet = computed(() => {
        const p = this.personnelInfo();
        return p ? `${p.prenom} ${p.nom}` : '';
    });

    salaireNet = computed(() => this.avanceInfo()?.netAmount || 0);
    limiteAvance = computed(() => this.avanceInfo()?.netAmountLimit || 0);

    totalDemandesActives = computed(() => {
        return this.demandesActives().reduce((sum, d) => sum + (d.amount || 0), 0);
    });

    montantDisponible = computed(() => {
        const limite = this.limiteAvance();
        const totalActif = this.totalDemandesActives();
        return Math.max(0, limite - totalActif);
    });

    hasNumeroCompte = computed(() => {
        const p = this.personnelInfo();
        return p?.numeroCompte && p.numeroCompte.trim() !== '';
    });

    isNumeroCompteValid = computed(() => {
        const numeroCompte = this.formNumeroCompte();
        return /^\d{11}$/.test(numeroCompte);
    });

    isAmountValid = computed(() => {
        const amount = this.formAmount();
        return amount > 0 && amount <= this.montantDisponible();
    });

    canSubmit = computed(() => {
        return this.isAmountValid() && this.isNumeroCompteValid() && !this.isSubmitting();
    });

    steps = [{ label: 'Recherche' }, { label: 'Vérification' }, { label: 'Demande' }, { label: 'Confirmation' }];

    // ==================== LIFECYCLE ====================

    ngOnInit(): void {
        this.checkAuthorization();

        this.demandeForm.valueChanges.subscribe((values) => {
            this.formAmount.set(values.amount || 0);
            this.formNumeroCompte.set(values.numeroCompte || '');
        });
    }

    // ==================== AUTORISATION ====================

    checkAuthorization(): void {
        console.log("🔄 Vérification de l'autorisation...");
        this.isCheckingAuthorization.set(true);

        this.salaireService.getAuthorizeSalaire().subscribe({
            next: (response) => {
                console.log('📥 Réponse autorisation:', response);

                let authorized = false;
                let message = "Les demandes d'avance sur salaire ne sont pas disponibles pour le moment. Contactez la Direction des Ressources Humaines.";

                if (response.data?.authorize) {
                    const authorize = response.data.authorize as AuthorizeSalaireDto;
                    authorized = authorize.isAuthorized === true;
                    message = authorize.message || message;
                } else if (response.data) {
                    authorized = response.data.isAuthorized === true;
                    message = response.data.message || message;
                }

                console.log('✅ Autorisation:', authorized, '| Message:', message);

                this.isAuthorized.set(authorized);
                this.authorizationMessage.set(message);
                this.isCheckingAuthorization.set(false);

                this.cdr.detectChanges();

                if (authorized) {
                    console.log('🚀 Chargement des infos de salaire...');
                    this.searchError.set('');
                    this.currentStep.set(0);
                    this.loadMyAvanceInfo();
                }
            },
            error: (error) => {
                console.error('❌ Erreur vérification autorisation:', error);
                this.isAuthorized.set(false);
                this.authorizationMessage.set("Impossible de vérifier l'état des demandes. Veuillez réessayer plus tard.");
                this.isCheckingAuthorization.set(false);
                this.cdr.detectChanges();
            }
        });
    }

    // ==================== CHARGEMENT INFOS SALAIRE ====================

    loadMyAvanceInfo(): void {
        if (!this.isAuthorized()) {
            console.log('⚠️ Non autorisé, pas de chargement');
            return;
        }

        this.isSearching.set(true);
        this.searchError.set('');
        this.needsManualMatricule.set(false);

        this.salaireService.getMyAvanceSalaire().subscribe({
            next: (response) => {
                console.log('📥 Réponse avance salaire:', response);

                if (response.data?.avance) {
                    this.processAvanceData(response.data.avance);
                    this.hasMatriculeInAccount.set(true);
                    this.loadDemandesActives();
                    this.currentStep.set(1);
                } else if (response.data?.hasMatricule === false) {
                    // ✅ L'utilisateur n'a PAS de matricule dans son compte
                    console.log('⚠️ Utilisateur sans matricule, afficher formulaire de recherche');
                    this.hasMatriculeInAccount.set(false);
                    this.needsManualMatricule.set(true);
                    this.isSearching.set(false);
                } else {
                    this.searchError.set("Aucune donnée de salaire trouvée. Le fichier des salaires n'a peut-être pas été importé.");
                    this.isSearching.set(false);
                }
            },
            error: (error) => {
                console.error('❌ Erreur chargement avance:', error);

                // ✅ Vérifier si c'est une erreur "pas de matricule"
                const errorMessage = error.error?.message || '';
                if (errorMessage.includes('matricule') || error.status === 400) {
                    console.log('⚠️ Erreur matricule, afficher formulaire de recherche');
                    this.hasMatriculeInAccount.set(false);
                    this.needsManualMatricule.set(true);
                    this.searchError.set('');
                } else {
                    this.searchError.set(errorMessage || 'Impossible de charger vos informations de salaire.');
                }
                this.isSearching.set(false);
            }
        });
    }

    // ==================== RECHERCHE MANUELLE PAR MATRICULE ====================

    /**
     * Rechercher un matricule saisi manuellement
     */
    searchMatricule(): void {
        const matricule = this.searchForm.get('matricule')?.value?.trim();

        if (!matricule) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez saisir un matricule'
            });
            return;
        }

        console.log('🔍 Recherche matricule:', matricule);
        this.isSearchingMatricule.set(true);
        this.matriculeSearchError.set('');

        // Rechercher par matricule via l'API
        this.salaireService.getAvanceSalaireByMatricule(matricule).subscribe({
            next: (response) => {
                console.log('📥 Réponse recherche matricule:', response);

                if (response.data?.avance) {
                    // ✅ Matricule trouvé !
                    this.manualMatricule.set(matricule);
                    this.processAvanceData(response.data.avance);
                    this.needsManualMatricule.set(false);
                    this.loadDemandesActivesByMatricule(matricule);
                    this.currentStep.set(1);

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Matricule trouvé ! Vous pouvez continuer.'
                    });
                } else {
                    this.matriculeSearchError.set("Ce matricule n'existe pas dans le fichier de salaire du mois en cours.");
                }
                this.isSearchingMatricule.set(false);
            },
            error: (error) => {
                console.error('❌ Erreur recherche matricule:', error);
                this.matriculeSearchError.set(error.error?.message || "Ce matricule n'a pas été trouvé. Vérifiez qu'il existe dans le fichier du personnel et le fichier de salaire.");
                this.isSearchingMatricule.set(false);
            }
        });
    }

    /**
     * Charger les demandes actives par matricule (pour utilisateurs sans matricule dans compte)
     */
    private loadDemandesActivesByMatricule(matricule: string): void {
        this.isLoadingDemandes.set(true);

        // Utiliser l'endpoint qui charge toutes les demandes et filtrer côté client
        // Ou créer un nouvel endpoint backend si nécessaire
        this.salaireService.getDemandeSalaryByStatut('ENCOURS').subscribe({
            next: (response) => {
                if (response.data?.demandes) {
                    const allDemandes = response.data.demandes as unknown as DemandeSalaryDto[];
                    // Filtrer par matricule
                    const actives = allDemandes.filter((d) => d.matricule === matricule && ['ENCOURS', 'VALIDER', 'CONFIRMER'].includes(d.statut!));
                    this.demandesActives.set(actives);
                }
                this.isSearching.set(false);
                this.isLoadingDemandes.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement demandes:', error);
                this.demandesActives.set([]);
                this.isSearching.set(false);
                this.isLoadingDemandes.set(false);
            }
        });
    }

    /**
     * Traiter les données d'avance reçues
     */
    private processAvanceData(avance: any): void {
        this.avanceInfo.set(avance as unknown as AvanceSalaireDto);

        this.personnelInfo.set({
            matricule: avance.matricule,
            nom: avance.nomPersonnel,
            prenom: avance.prenomPersonnel,
            numeroCompte: avance.numeroCompte
        } as InfoPersonnelDto);

        // Pré-remplir le numéro de compte
        if (avance.numeroCompte && /^\d{11}$/.test(avance.numeroCompte)) {
            this.demandeForm.patchValue({ numeroCompte: avance.numeroCompte });
            this.formNumeroCompte.set(avance.numeroCompte);
        }
    }

    private loadDemandesActives(): void {
        this.isLoadingDemandes.set(true);

        this.salaireService.getMyDemandeSalary().subscribe({
            next: (response) => {
                if (response.data?.demandes) {
                    const demandes = response.data.demandes as unknown as DemandeSalaryDto[];
                    const actives = demandes.filter((d) => ['ENCOURS', 'VALIDER', 'CONFIRMER'].includes(d.statut!));
                    this.demandesActives.set(actives);
                }
                this.isSearching.set(false);
                this.isLoadingDemandes.set(false);
            },
            error: (error) => {
                console.error('Erreur chargement demandes:', error);
                this.isSearching.set(false);
                this.isLoadingDemandes.set(false);
            }
        });
    }

    // ==================== SOUMISSION ====================

    goToForm(): void {
        if (this.montantDisponible() <= 0) {
            this.messageService.add({
                severity: 'error',
                summary: 'Limite atteinte',
                detail: "Vous avez atteint votre limite d'avance. Aucune nouvelle demande possible."
            });
            return;
        }
        this.currentStep.set(2);
    }

    onNumeroCompteInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        const cleaned = input.value.replace(/\D/g, '').substring(0, 11);
        input.value = cleaned;
        this.demandeForm.patchValue({ numeroCompte: cleaned });
        this.formNumeroCompte.set(cleaned);
    }

    onAmountChange(event: any): void {
        const value = event?.value ?? event ?? 0;
        this.formAmount.set(Number(value) || 0);
    }

    goToMesDemandes(): void {
        this.router.navigate(['/dashboards/mes-demandes-salaire']);
    }

    submitDemande(): void {
        if (!this.canSubmit()) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Formulaire invalide',
                detail: 'Veuillez vérifier les informations saisies'
            });
            return;
        }

        const amount = this.formAmount();
        const numeroCompte = this.formNumeroCompte();
        const matricule = this.matricule();

        this.isSubmitting.set(true);

        // ✅ Utiliser l'endpoint approprié selon si l'utilisateur a un matricule dans son compte ou non
        let submitObservable;

        if (this.hasMatriculeInAccount()) {
            // Utilisateur avec matricule dans son compte → /demande-salary/me
            submitObservable = this.salaireService.createMyDemandeSalary(amount, numeroCompte);
        } else {
            // Utilisateur sans matricule → /demande-salary avec matricule explicite
            submitObservable = this.salaireService.createDemandeSalary(matricule, amount, numeroCompte);
        }

        submitObservable.subscribe({
            next: (response) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: "Votre demande d'avance sur salaire a été créée avec succès"
                });
                this.isSubmitting.set(false);
                this.currentStep.set(3);
            },
            error: (error) => {
                console.error('Erreur création demande:', error);
                const message = error.error?.message || 'Erreur lors de la création de la demande';
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: message
                });
                this.isSubmitting.set(false);
            }
        });
    }

    reset(): void {
        this.demandeForm.reset();
        this.searchForm.reset();
        this.formAmount.set(0);
        this.formNumeroCompte.set('');
        this.manualMatricule.set('');
        this.personnelInfo.set(null);
        this.avanceInfo.set(null);
        this.demandesActives.set([]);
        this.searchError.set('');
        this.matriculeSearchError.set('');
        this.needsManualMatricule.set(false);
        this.currentStep.set(0);
        this.checkAuthorization();
    }

    formatMontant(montant: number | undefined): string {
        if (montant === undefined || montant === null) return '-';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    getUsageClass(): string {
        const limite = this.limiteAvance();
        const utilise = this.totalDemandesActives();
        if (limite === 0) return '';

        const pourcentage = (utilise / limite) * 100;
        if (pourcentage >= 100) return 'usage-full';
        if (pourcentage >= 75) return 'usage-high';
        if (pourcentage >= 50) return 'usage-medium';
        return 'usage-low';
    }

    getStatutSeverity(statut: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
        switch (statut?.toUpperCase()) {
            case 'ENCOURS':
                return 'info';
            case 'VALIDER':
                return 'success';
            case 'CONFIRMER':
                return 'success';
            case 'REJET':
                return 'danger';
            case 'ANNULLER':
                return 'secondary';
            default:
                return 'info';
        }
    }
}
