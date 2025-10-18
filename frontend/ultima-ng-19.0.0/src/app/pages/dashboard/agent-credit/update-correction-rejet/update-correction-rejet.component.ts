import { Component, computed, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PersonnePhysique } from '@/interface/personnePhysique';
import { ReferenceData } from '@/interface/reference-data.interface';
import { TextareaModule } from 'primeng/textarea';
import { MotifCorrection } from '@/interface/MotifCorrection';

@Component({
    selector: 'app-update-correction-rejet',
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, TextareaModule, CardModule, ToastModule, ProgressSpinnerModule, DividerModule, TagModule, CalendarModule, DropdownModule, InputNumberModule],
    templateUrl: './update-correction-rejet.component.html',
    styleUrl: './update-correction-rejet.component.scss',
    providers: [MessageService]
})
export class UpdateCorrectionRejetComponent implements OnInit {
    state = signal<{
        user?: IUser;
        personnePhysique?: PersonnePhysique;
        motif?: MotifCorrection;
        loading: boolean;
        updating: boolean;
        message: string | undefined;
        error: string | any;
        codCliente?: string;
    }>({
        loading: false,
        updating: false,
        message: undefined,
        error: undefined
    });

    // Computed signals
    isLoading = computed(() => this.state().loading);
    isUpdating = computed(() => this.state().updating);
    hasError = computed(() => !!this.state().error);
    personneData = computed(() => this.state().personnePhysique);
    motifData = computed(() => this.state().motif);

    // Form
    personneForm!: FormGroup;

    // Options for dropdowns
    sexeOptions = [
        { label: 'Masculin', value: 'M' },
        { label: 'Féminin', value: 'F' }
    ];

    etatCivilOptions = [
        { label: 'Célibataire', value: 'S' },
        { label: 'Marié(e)', value: 'C' },
        { label: 'Autre', value: 'O' }
    ];

    typeHabitOptions = [
        { label: 'Propriétaire', value: 'PO' },
        { label: 'Locataire', value: 'AL' }
    ];

    typeEntreOptions = [
        { label: 'Propriétaire', value: 'PO' },
        { label: 'Locataire', value: 'AL' }
    ];

    typePieceOptions = ReferenceData.ID_TYPES.map((item) => ({
        label: item.label,
        value: item.code
    }));

    provinceOptions = ReferenceData.PROVINCES.map((item) => ({
        label: item.label,
        value: item.code
    }));

    sectorOptions = ReferenceData.SECTORS.map((item) => ({
        label: item.label,
        value: item.code
    }));

    activityOptions = ReferenceData.ACTIVITIES.map((item) => ({
        label: item.label,
        value: item.code
    }));

    professionOptions = ReferenceData.PROFESSIONS.map((item) => ({
        label: item.label,
        value: item.code
    }));

    cantonOptions: any[] = [];
    districtOptions: any[] = [];

    // Services
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);

    ngOnInit(): void {
        this.initializeForm();

        // Watch for province changes
        this.personneForm
            .get('codProvincia')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((provinceCode) => {
                if (provinceCode) {
                    this.loadCantons(provinceCode);
                    this.personneForm.patchValue({
                        codCanton: '',
                        district: ''
                    });
                } else {
                    this.cantonOptions = [];
                    this.districtOptions = [];
                }
            });

        // Watch for canton changes
        this.personneForm
            .get('codCanton')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((cantonCode) => {
                const provinceCode = this.personneForm.get('codProvincia')?.value;
                if (provinceCode && cantonCode) {
                    this.loadDistricts(provinceCode, cantonCode);
                } else {
                    this.districtOptions = [];
                }
            });

        // Get code client from route params
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            if (params['codCliente']) {
                const codCliente = params['codCliente'];
                this.state.update((s) => ({ ...s, codCliente }));

                // Load user and personne physique data
                this.loadUser();
                this.loadPersonnePhysique(codCliente);
            }
        });
    }

    initializeForm(): void {
        this.personneForm = this.fb.group({
            // Identification
            codCliente: ['', [Validators.required, Validators.pattern(/^\d{9,11}$/)]],
            numId: ['', Validators.required],
            typePiece: ['', Validators.required],

            // Informations personnelles
            nomCliente: ['', Validators.required],
            nomClient: ['', Validators.required],
            prenomClient: ['', Validators.required],

            // Contacts
            telPrincipal: ['', [Validators.required, Validators.pattern(/^\d{9,10}$/)]],
            telOtro: [''],

            // Dates
            fecVencim: [null],
            fechNacimiento: [null, Validators.required],
            dateAttente: [null],

            // Lieu et nationalité
            lieuxNaiss: ['', Validators.required],
            nationalite: ['Guinéenne', Validators.required],
            pays: ['GN', Validators.required],

            // Bénéficiaire
            nomBeneficiario: [''],
            relacBeneficiario: [''],

            // Adresse
            detDireccion: [''],
            codProvincia: [''],
            codCanton: [''], // AJOUTÉ
            district: [''],
            agence: [''],
            codeAgence: [''],

            // Professionnel
            codActividad: [''],
            codProfesion: [''],
            codSector: [''],
            typeEntre: [''],
            nbrAnnee2: [null],

            // Personnel et familial
            indSexo: ['', Validators.required],
            estCivil: [''],
            conjoint: ['', [Validators.maxLength(15)]],
            nbrEnfant: [0],

            // Logement
            typeHabit: [''],
            nbrAnnee: [null],

            // Administratif
            statutClt: ['A'],
            nature: ['PP'],
            provServDestino: ['']
        });
    }

    loadUser(): void {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({
                        ...s,
                        user: response.data.user,
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        error: error,
                        loading: false
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations utilisateur',
                        life: 5000
                    });
                }
            });
    }

    loadPersonnePhysique(codCliente: string): void {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService
            .getPersonnePhysique$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response?.data?.personnePhysique) {
                        const personneData = response.data.personnePhysique as PersonnePhysique;
                        const motifData = response.data.motif;

                        this.state.update((s) => ({
                            ...s,
                            personnePhysique: personneData,
                            motif: motifData, // NOUVEAU
                            loading: false
                        }));

                        // Populate form with personne physique data
                        this.populateFormFromPersonne(personneData);

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Données chargées avec succès',
                            life: 3000
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        error: error,
                        loading: false
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les données du client',
                        life: 5000
                    });
                }
            });
    }

    private isPopulatingFromPersonne = false;

    loadCantons(provinceCode: string): void {
        const cantons = ReferenceData.getCantonsByProvince(provinceCode);
        this.cantonOptions = cantons.map((item) => ({
            label: item.label,
            value: item.code
        }));
    }

    loadDistricts(provinceCode: string, cantonCode?: string): void {
        this.districtOptions = ReferenceData.getDistrictsByProvince(provinceCode, cantonCode).map((item) => ({
            label: item.label,
            value: item.codDistrito
        }));

        const currentDistrict = this.personneForm.get('district')?.value;
        if (currentDistrict && !this.districtOptions.find((d) => d.value === currentDistrict)) {
            this.personneForm.patchValue({ district: '' });
        }
    }

    populateFormFromPersonne(personneData: PersonnePhysique): void {
        this.isPopulatingFromPersonne = true;

        const formData = {
            // Identification
            codCliente: personneData.codCliente || '',
            numId: personneData.numId || '',
            typePiece: personneData.typePiece || '',
            fecVencim: this.parseDate(personneData.fecVencim),

            // Personal info
            nomCliente: personneData.nomCliente || '',
            nomClient: personneData.nomClient || '',
            prenomClient: personneData.prenomClient || '',

            // Contact
            telPrincipal: personneData.telPrincipal || '',
            telOtro: personneData.telOtro || '',

            // Birth/Location
            fechNacimiento: this.parseDate(personneData.fechNacimiento),
            lieuxNaiss: personneData.lieuxNaiss || '',
            nationalite: personneData.nationalite || 'Guinéenne',
            pays: personneData.pays || 'GN',

            // Beneficiary
            nomBeneficiario: personneData.nomBeneficiario || '',
            relacBeneficiario: personneData.relacBeneficiario || '',

            // Address
            detDireccion: personneData.detDireccion || '',
            codProvincia: personneData.codProvincia || '',
            codCanton: personneData.codCanton || '', // AJOUTÉ
            district: personneData.district || '',
            agence: personneData.agence || '',
            codeAgence: personneData.codeAgence || '',

            // Professional
            codActividad: personneData.codActividad || '',
            codProfesion: personneData.codProfesion || '',
            codSector: personneData.codSector || '',
            typeEntre: personneData.typeEntre || '',
            nbrAnnee2: personneData.nbrAnnee2 || null,

            // Personal/Family
            indSexo: personneData.indSexo || '',
            estCivil: personneData.estCivil || '',
            conjoint: personneData.conjoint || '',
            nbrEnfant: personneData.nbrEnfant || 0,

            // Housing
            typeHabit: personneData.typeHabit || '',
            nbrAnnee: personneData.nbrAnnee || null,

            // Admin
            statutClt: personneData.statutClt || 'A',
            nature: personneData.nature || 'PP',
            provServDestino: personneData.provServDestino || ''
        };

        // Load cantons and districts if province is set
        if (formData.codProvincia) {
            this.loadCantons(formData.codProvincia);

            const { codCanton, district, ...formDataWithoutCantonDistrict } = formData;

            this.personneForm.patchValue(formDataWithoutCantonDistrict);

            if (codCanton) {
                setTimeout(() => {
                    this.personneForm.patchValue({ codCanton: codCanton });

                    this.loadDistricts(formData.codProvincia, codCanton);

                    if (district) {
                        setTimeout(() => {
                            this.personneForm.patchValue({ district: district });
                            this.isPopulatingFromPersonne = false;
                        }, 100);
                    } else {
                        this.isPopulatingFromPersonne = false;
                    }
                }, 100);
            } else {
                this.isPopulatingFromPersonne = false;
            }
        } else {
            this.personneForm.patchValue(formData);
            this.isPopulatingFromPersonne = false;
        }
    }

    // Convertir le format de date du backend [year, month, day] en objet Date
    parseDate(dateValue: any): Date | null {
        if (!dateValue) {
            return null;
        }

        if (dateValue instanceof Date) {
            return dateValue;
        }

        if (typeof dateValue === 'string') {
            return new Date(dateValue);
        }

        if (Array.isArray(dateValue) && dateValue.length >= 3) {
            return new Date(dateValue[0], dateValue[1] - 1, dateValue[2]);
        }

        return null;
    }

    onSubmit(): void {
        if (this.personneForm.invalid) {
            this.personneForm.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Veuillez remplir tous les champs obligatoires',
                life: 3000
            });
            return;
        }

        this.state.update((s) => ({ ...s, updating: true }));

        const formValue = this.personneForm.value;

        const personnePhysique: PersonnePhysique = {
            ...formValue,
            fecVencim: this.formatDate(formValue.fecVencim),
            fechNacimiento: this.formatDate(formValue.fechNacimiento),
            dateAttente: this.formatDate(formValue.dateAttente),
            correctionStatut: 'EN_ATTENTE'
        };

        this.userService
            .updatePersonnePhysique$(personnePhysique)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({ ...s, updating: false }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Correction mise à jour avec succès et resoumise pour validation',
                        life: 3000
                    });

                    setTimeout(() => {
                        this.router.navigate(['/dashboards']);
                    }, 2000);
                },
                error: (error) => {
                    this.state.update((s) => ({ ...s, updating: false }));

                    const errorMessage = error.error?.message || 'Erreur lors de la mise à jour';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage,
                        life: 5000
                    });
                }
            });
    }

    formatDate(date: any): string | undefined {
        if (!date) return undefined;
        if (date instanceof Date) {
            return date.toISOString().split('T')[0];
        }
        return date;
    }

    cancel(): void {
        this.router.navigate(['/dashboards']);
    }

    get f() {
        return this.personneForm.controls;
    }

    getCorrectionStatusLabel(status: string): string {
        switch (status) {
            case 'REJETE':
                return 'Rejetée';
            case 'EN_ATTENTE':
                return 'En attente';
            case 'VALIDE':
                return 'Validée';
            default:
                return status;
        }
    }

    getCorrectionStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (status) {
            case 'VALIDE':
                return 'success';
            case 'REJETE':
                return 'danger';
            case 'EN_ATTENTE':
                return 'info';
            default:
                return 'secondary';
        }
    }

    // NOUVEAU: Formater la date pour l'affichage
    formatDisplayDate(dateString: string): string {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}
