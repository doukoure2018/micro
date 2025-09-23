import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UserService } from '@/service/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';

import { ReferenceData } from '@/interface/reference-data.interface';
import { FicheSignaletique } from '@/interface/ficheSignaletique';
import { PersonnePhysique } from '@/interface/personnePhysique';

@Component({
    selector: 'app-add-personne-physique',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CalendarModule, DropdownModule, InputNumberModule, ToastModule],
    templateUrl: './add-personne-physique.component.html',
    styleUrl: './add-personne-physique.component.scss',
    providers: [MessageService]
})
export class AddPersonnePhysiqueComponent implements OnInit {
    @Input() userId?: number;

    private _ficheData?: FicheSignaletique;
    @Input()
    set ficheData(value: FicheSignaletique | undefined) {
        console.log('=== FicheData setter called ===');
        console.log('Received value:', value);
        this._ficheData = value;

        // Only populate if we have both data and form
        if (value && this.personneForm) {
            console.log('Both data and form exist, populating now');
            setTimeout(() => {
                this.populateFormFromFiche();
            }, 0);
        }
    }
    get ficheData(): FicheSignaletique | undefined {
        return this._ficheData;
    }

    @Output() onSave = new EventEmitter<PersonnePhysique>();
    @Output() onCancel = new EventEmitter<void>();

    personneForm!: FormGroup;
    loading = signal(false);

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

    districtOptions: any[] = [];

    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);

    ngOnInit(): void {
        console.log('=== Component ngOnInit ===');
        console.log('ficheData at init:', this.ficheData);
        console.log('userId at init:', this.userId);

        this.initializeForm();

        // Try to populate if we already have data
        if (this.ficheData) {
            console.log('Data exists at init, populating form');
            this.populateFormFromFiche();
        }

        // Watch for province changes
        this.personneForm.get('codProvincia')?.valueChanges.subscribe((provinceCode) => {
            if (provinceCode) {
                this.loadDistricts(provinceCode);
            }
        });
    }

    loadDistricts(provinceCode: string): void {
        this.districtOptions = ReferenceData.getDistrictsByProvince(provinceCode).map((item) => ({
            label: item.label,
            value: item.code
        }));

        // Don't reset district if it's being set from ficheData
        const currentDistrict = this.personneForm.get('district')?.value;
        if (currentDistrict && !this.districtOptions.find((d) => d.value === currentDistrict)) {
            this.personneForm.patchValue({ district: '' });
        }
    }

    initializeForm(): void {
        this.personneForm = this.fb.group({
            // Identification - Note: backend expects codCliente not codClientes
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
            conjoint: [''],
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

    populateFormFromFiche(): void {
        console.log('=== populateFormFromFiche called ===');

        if (!this.ficheData) {
            console.log('No fiche data available');
            return;
        }

        if (!this.personneForm) {
            console.log('Form not initialized yet');
            return;
        }

        console.log('Fiche data to use:', this.ficheData);

        // Map the data according to the actual response structure
        const formData = {
            // Identification
            codCliente: this.ficheData.codCliente || '',
            numId: this.ficheData.numId || '',
            typePiece: this.ficheData.codTipoId || '',
            fecVencim: this.ficheData.fecVencim ? new Date(this.ficheData.fecVencim) : null,

            // Personal info
            nomCliente: this.ficheData.nomCliente || '',
            nomClient: this.ficheData.primerApellido || '',
            prenomClient: this.ficheData.primerNombre || '',

            // Contact
            telPrincipal: this.ficheData.telPrincipal || '',
            telOtro: this.ficheData.telOtro || '',

            // Birth/Location
            fechNacimiento: this.ficheData.fechNacimiento ? new Date(this.ficheData.fechNacimiento) : null,
            lieuxNaiss: this.ficheData.lugarNacimiento || '',
            nationalite: this.ficheData.nacionalidad || 'Guinéenne',
            pays: this.ficheData.codPais || 'GN',

            // Beneficiary
            nomBeneficiario: this.ficheData.nomBeneficiario || '',
            relacBeneficiario: this.ficheData.relacBeneficiario || '',

            // Address
            detDireccion: this.ficheData.detDireccion || '',
            codProvincia: this.ficheData.codProvincia || '',
            district: this.ficheData.codDistrito || '',
            codeAgence: this.ficheData.codAgencia || '',

            // Professional
            codActividad: this.ficheData.codActividad || '',
            codProfesion: this.ficheData.codProfesion || '',
            codSector: this.ficheData.codSector || '',

            // Personal/Family
            indSexo: this.ficheData.indSexo || '',
            estCivil: this.ficheData.estCivil || '',
            conjoint: this.ficheData.codCteConyugue || this.ficheData.nomConyugue || '',
            nbrEnfant: this.ficheData.numHijos || 0,

            // Housing - Note: PR for Propriétaire, not PO
            typeHabit: this.mapHousingType(this.ficheData.tenenciaVivienda),
            nbrAnnee: this.ficheData.antiguedadResidencia || null,

            // Business ownership - Note: PR for Propriétaire, not PO
            typeEntre: this.mapHousingType(this.ficheData.tenenciaPuesto),
            nbrAnnee2: this.ficheData.antiguedadPuesto || null,

            // Admin
            statutClt: this.ficheData.indEstado || 'A',
            nature: 'PP',
            provServDestino: this.ficheData.provServDestino || ''
        };

        console.log('Mapped form data:', formData);

        this.personneForm.patchValue(formData);

        // Load districts if province is set
        if (formData.codProvincia) {
            this.loadDistricts(formData.codProvincia);
            const { district, ...formDataWithoutDistrict } = formData;
            this.personneForm.patchValue(formDataWithoutDistrict);
            // Set district after loading options
            // We use the district value we extracted earlier
            if (district) {
                setTimeout(() => {
                    console.log('Setting district value:', district);
                    this.personneForm.patchValue({ district: district });
                    console.log('District set, form value:', this.personneForm.get('district')?.value);
                }, 100);
            }
        }

        console.log('Form values after patching:', this.personneForm.value);
    }

    // Helper method to map PR to PO (since your data uses PR for Propriétaire)
    private mapHousingType(value: string | null | undefined): string {
        if (!value) return '';
        // If PR (Propriétaire) in data, map to PO for the form
        if (value === 'PR') return 'PO';
        // If AL (Locataire) keep as is
        if (value === 'AL') return 'AL';
        // For any other value, return as is
        return value;
    }

    // Update the options to match what's in the database
    onSubmit(): void {
        if (this.personneForm.invalid) {
            this.personneForm.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Veuillez remplir tous les champs obligatoires'
            });
            return;
        }

        this.loading.set(true);

        const formValue = this.personneForm.value;

        // Format dates for backend
        const personnePhysique: PersonnePhysique = {
            ...formValue,
            fecVencim: this.formatDate(formValue.fecVencim),
            fechNacimiento: this.formatDate(formValue.fechNacimiento),
            dateAttente: this.formatDate(formValue.dateAttente),
            idUser: this.userId || undefined,
            idManagerAgent: null,
            correctionStatut: 'EN_ATTENTE'
        };

        console.log('Submitting personne physique:', personnePhysique);

        this.userService
            .addPersonnePhysique$(personnePhysique)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.loading.set(false);
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Personne physique créée avec succès'
                    });
                    this.onSave.emit(response.data.personnePhysique as PersonnePhysique);
                },
                error: (error) => {
                    this.loading.set(false);
                    const errorMessage = error.error?.message || 'Erreur lors de la création';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage
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
        this.onCancel.emit();
    }

    get f() {
        return this.personneForm.controls;
    }
}
