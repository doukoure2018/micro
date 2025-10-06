import { CompteInfo } from '@/interface/CompteInfo';
import { FicheSignaletiqueWithSolde } from '@/interface/FicheSignaletiqueWithSolde';
import { Individuel } from '@/interface/individuel';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
    selector: 'app-digital-verification',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, TableModule, TagModule, ToastModule, ProgressSpinnerModule, DividerModule, PanelModule, TabViewModule],
    templateUrl: './digital-verification.component.html',
    styleUrl: './digital-verification.component.scss'
})
export class DigitalVerificationComponent implements OnInit {
    @Input() user?: IUser;
    state = signal<{
        user?: IUser;
        individuel?: Individuel;
        ficheSignaletique?: FicheSignaletiqueWithSolde;
        loading: boolean;
        searching: boolean;
        message?: string;
        error?: string;
    }>({
        loading: false,
        searching: false,
        message: undefined,
        error: undefined
    });

    searchForm!: FormGroup;
    updateForm!: FormGroup;

    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRoute = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    ngOnInit(): void {
        this.initializeForms();
        this.setupSearchListener();
        this.loadUserInfo();
    }

    initializeForms(): void {
        // Search form for client code
        this.searchForm = this.fb.group({
            codCliente: ['', [Validators.required, Validators.minLength(11)]]
        });

        // Update form for client information
        this.updateForm = this.fb.group({
            codCliente: [{ value: '', disabled: true }],
            nomCliente: ['', Validators.required],
            telPrincipal: [''],
            telOtro: [''],
            detDireccion: [''],
            codProvincia: [''],
            codActividad: [''],
            codProfesion: [''],
            indSexo: [''],
            estCivil: [''],
            typeHabit: [''],
            nbrEnfant: [0],
            district: [''],
            pays: [''],
            typePiece: [''],
            numId: [''],
            nomBeneficiario: [''],
            relacBeneficiario: ['']
        });
    }

    setupSearchListener(): void {
        // Auto-search when typing stops
        this.searchForm
            .get('codCliente')
            ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                if (value && value.length >= 11) {
                    this.searchClient();
                }
            });
    }

    loadUserInfo(): void {
        this.userService
            .profile$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    if (response.data?.user) {
                        this.state.update((s) => ({ ...s, user: response.data.user }));
                    }
                },
                error: (error) => {
                    console.error('Error loading user profile:', error);
                }
            });
    }

    searchClient(): void {
        const codCliente = this.searchForm.get('codCliente')?.value;

        if (!codCliente) {
            this.showError('Veuillez saisir un code client');
            return;
        }

        this.state.update((s) => ({
            ...s,
            searching: true,
            error: undefined,
            ficheSignaletique: undefined
        }));

        // Call the new endpoint with soldes
        this.userService
            .getFicheSignaletiqueWithSolde$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Response received:', response);

                    // The actual data is nested in response.data.data based on the Postman response
                    if (response?.data?.data) {
                        const ficheData = response.data.data as FicheSignaletiqueWithSolde;
                        console.log('Fiche data extracted:', ficheData);

                        this.state.update((s) => ({
                            ...s,
                            searching: false,
                            ficheSignaletique: ficheData,
                            error: undefined
                        }));

                        // Populate update form with client data
                        this.populateUpdateForm(ficheData);

                        // Show success with account summary
                        const metadata = response.data.metadata;
                        if (metadata) {
                            this.showSuccess(`Fiche signalétique récupérée - ${metadata.totalComptes} compte(s), Solde disponible: ${this.formatCurrency(ficheData.totalSoldeDisponible)}`);
                        } else {
                            this.showSuccess('Fiche signalétique récupérée avec succès');
                        }
                    } else {
                        this.state.update((s) => ({
                            ...s,
                            searching: false,
                            error: 'Aucune donnée trouvée'
                        }));
                        this.showWarning('Aucune donnée trouvée pour ce client');
                    }
                },
                error: (error) => {
                    console.error('Error fetching fiche signalétique:', error);
                    this.state.update((s) => ({
                        ...s,
                        searching: false,
                        error: error.message || 'Erreur lors de la récupération des données'
                    }));
                    this.showError(error.message || 'Erreur lors de la récupération des données');
                }
            });
    }

    populateUpdateForm(data: any): void {
        this.updateForm.patchValue({
            codCliente: data.codCliente,
            nomCliente: data.nomCliente || data.nombreComplet,
            telPrincipal: data.telPrincipal,
            telOtro: data.telOtro,
            detDireccion: data.detDireccion,
            codProvincia: data.codProvincia,
            codActividad: data.codActividad,
            codProfesion: data.codProfesion,
            indSexo: data.indSexo,
            estCivil: data.estCivil,
            typeHabit: data.tenenciaVivienda,
            nbrEnfant: data.numHijos,
            district: data.codDistrito,
            pays: data.codPais,
            typePiece: data.codTipoId,
            numId: data.numId,
            nomBeneficiario: data.nomBeneficiario,
            relacBeneficiario: data.relacBeneficiario
        });
    }

    getTotalSoldeDisponible(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeDisponible || 0;
    }

    getTotalSoldeMoyen(): number {
        const fiche = this.state().ficheSignaletique;
        return fiche?.totalSoldeMoyen || 0;
    }

    getComptes(): CompteInfo[] {
        const fiche = this.state().ficheSignaletique;
        return fiche?.comptes || [];
    }

    getStatutSeverity(indRelacion: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | undefined {
        switch (indRelacion) {
            case 'A':
                return 'success';
            case 'I':
                return 'danger';
            case 'S':
                return 'warn';
            case 'C':
                return 'contrast';
            case 'E':
                return 'secondary';
            default:
                return 'info';
        }
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('fr-GN', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value || 0);
    }

    formatDate(date: any): string {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR');
    }

    clearSearch(): void {
        this.searchForm.reset();
        this.updateForm.reset();
        this.state.update((s) => ({
            ...s,
            ficheSignaletique: undefined,
            error: undefined
        }));
    }

    // Message service methods
    showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    }

    showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    }

    showWarning(message: string): void {
        this.messageService.add({
            severity: 'warn',
            summary: 'Attention',
            detail: message,
            life: 4000
        });
    }

    showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: message,
            life: 3000
        });
    }
}
