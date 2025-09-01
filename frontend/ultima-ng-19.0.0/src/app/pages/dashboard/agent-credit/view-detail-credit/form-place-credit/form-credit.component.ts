import { Actividad } from '@/interface/actividad.model';
import { ClientesDto } from '@/interface/clientes-dto.model';
import { CreditRequest } from '@/interface/creditRequest';
import { CreditResponse } from '@/interface/creditResponse';
import { Inversion } from '@/interface/inversion.model';
import { NewCredit } from '@/interface/newCredit';
import { OriginFond } from '@/interface/originFonds';
import { Requisito } from '@/interface/requisito.model';
import { RequisitoRequest } from '@/interface/requisitoRequest';
import { IResponse } from '@/interface/response';
import { SousActivite } from '@/interface/sous-activite.model';
import { SousSousActivite } from '@/interface/sous-sous-activite.model';
import { TipoPlazo } from '@/interface/tipo-plazo.model';
import { TypeCreditDto } from '@/interface/typeCredit.model';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-mise-en-place-credit',
    imports: [CommonModule, FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, DropdownModule, TextareaModule, MultiSelectModule, CardModule, ProgressSpinnerModule, MessageModule, ToastModule],
    templateUrl: './form-credit.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FormCreditComponent {
    private userService = inject(UserService);
    private route = inject(ActivatedRoute);
    public router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);

    showSuccessModal = false;
    creditNumber = '';
    referenceCredit = '';

    state = signal<{
        membre?: ClientesDto;
        terms?: TipoPlazo[];
        cumulCredit?: number;
        countCredit?: number;
        pointVente?: number;
        inversions?: Inversion[];
        actividas?: Actividad[];
        sousActividas?: SousActivite[];
        sousSousActividas?: SousSousActivite[];
        filteredSousActividas?: SousActivite[];
        filteredSousSousActividas?: SousSousActivite[];
        requisitos?: RequisitoRequest[];
        typeCredito?: TypeCreditDto;
        creditDto?: NewCredit;
        originFonds?: OriginFond[];
        creditResponse?: CreditResponse;
        user?: IUser;
        selectedActividad?: string;
        selectedSousActivite?: string;
        loading: boolean;
        submitting: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submitting: false,
        message: undefined,
        error: undefined
    });

    ngOnInit(): void {
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const referenceCredit = params['referenceCredit'];
            const numeroMembre = params['numeroMembre'];
            const userId = +params['userId'];

            if (referenceCredit && numeroMembre && userId) {
                this.referenceCredit = referenceCredit;
                this.loadDetailsCredits(referenceCredit, numeroMembre, userId);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: 'Paramètres manquants pour charger les détails du crédit',
                    life: 5000
                });
            }
        });
    }

    loadDetailsCredits(referenceCredit: string, numeroMembre: string, userId: number): void {
        this.state.set({ ...this.state(), loading: true });

        this.userService
            .startMiseEnPlaceCredit$(referenceCredit, numeroMembre, userId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.set({
                        ...this.state(),
                        membre: response.data.membre,
                        user: response.data.user,
                        cumulCredit: response.data.cumulCredit,
                        countCredit: response.data.countCredit,
                        terms: response.data.terms,
                        inversions: response.data.inversions,
                        actividas: response.data.actividas,
                        sousActividas: response.data.sousActividas,
                        sousSousActividas: response.data.sousSousActividas,
                        requisitos: response.data.requisitos,
                        originFonds: response.data.originFonds,
                        typeCredito: response.data.typeCredito,
                        creditDto: response.data.creditDto,
                        loading: false,
                        message: response.message
                    });
                },
                error: (error) => {
                    console.error('Error loading credit details:', error);
                    this.state.set({
                        ...this.state(),
                        error: 'Erreur lors du chargement des détails du crédit',
                        loading: false
                    });

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les détails du crédit',
                        life: 5000
                    });
                }
            });
    }

    onActividadChange(event: any): void {
        const actividadId = event.value;

        if (actividadId) {
            // Filter sous-activités based on selected activité
            const filteredSousActivites = this.state().sousActividas?.filter((sa) => sa.codActividad === actividadId) || [];

            this.state.set({
                ...this.state(),
                selectedActividad: actividadId,
                selectedSousActivite: undefined,
                filteredSousActividas: filteredSousActivites,
                filteredSousSousActividas: []
            });
        } else {
            this.state.set({
                ...this.state(),
                selectedActividad: undefined,
                selectedSousActivite: undefined,
                filteredSousActividas: [],
                filteredSousSousActividas: []
            });
        }
    }

    onSousActiviteChange(event: any): void {
        const sousActiviteId = event.value;

        if (sousActiviteId && this.state().selectedActividad) {
            const filteredSousSousActivites = this.state().sousSousActividas?.filter((ssa) => ssa.codActividad === this.state().selectedActividad && ssa.codSousActivite === sousActiviteId) || [];

            this.state.set({
                ...this.state(),
                selectedSousActivite: sousActiviteId,
                filteredSousSousActividas: filteredSousSousActivites
            });
        } else {
            this.state.set({
                ...this.state(),
                selectedSousActivite: undefined,
                filteredSousSousActividas: []
            });
        }
    }

    onSubmit(form: NgForm): void {
        if (form.invalid) {
            // Marquer tous les champs comme touchés pour afficher les erreurs
            Object.keys(form.controls).forEach((key) => {
                const control = form.controls[key];
                control.markAsTouched();
            });

            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez remplir tous les champs obligatoires',
                life: 5000
            });
            return;
        }

        const formValue = form.value;
        // Utiliser les valeurs dynamiques du backend
        const userCode = this.state().user?.username.toLocaleUpperCase() || '';
        const empresaCode = '00000';
        const agenciaCode = this.state().membre?.codAgencia || '';

        console.log('Using dynamic user code:', userCode.toUpperCase());
        console.log('Using empresa code:', empresaCode);
        console.log('Using dynamic agencia code:', agenciaCode);

        // Validation des valeurs critiques
        if (!userCode || !agenciaCode) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Données utilisateur ou agence manquantes',
                life: 5000
            });
            this.state.set({ ...this.state(), submitting: false });
            return;
        }

        const creditRequest: CreditRequest = {
            codAgencia: agenciaCode, // Agence dynamique du membre
            tipCredito: parseInt(String(this.state().typeCredito?.typeCreditPKId?.tip_CREDITO ?? '1')),
            codCliente: this.state().membre?.clientesPKId?.codCliente || '',
            monCredito: this.state().creditDto?.montantCredit || 0,
            cantCuotas: parseInt(formValue.cantCuotas) || 1,
            codUsuario: userCode, // Username dynamique
            codOrigen: formValue.codOrigen || '',
            codPlanInversion: formValue.codPlanInversion || '',
            codPlazo: formValue.codPlazo || '',
            codActividad: this.state().selectedActividad || formValue.codActividad || '',
            codSubactiv: this.state().selectedSousActivite || formValue.codSubactiv || '',
            codSubsubactividad: formValue.codSubsubactividad || '',
            codTasaInt: formValue.codTasaInt || 'TCCRG', // Taux crédit personnel 10%
            codTasaMora: formValue.codTasaMora || 'PEN', // Intérêts pénalités 1%
            tipModalidadCobro: formValue.tipModalidadCobro || 'V', // V ou H autorisés
            tipInteres: formValue.tipInteres || 'A', // A ou V autorisés
            tipCalendario: parseInt(formValue.tipCalendario) || 1,
            tipCuota: formValue.tipCuota || '1',
            plazoCredito: parseInt(formValue.plazoCredito) || 0,
            tipTasa: formValue.tipTasa || 'F', // F ou V autorisés
            tasaInteres: parseFloat(formValue.tasaInteres) || 0,
            tasaMora: parseFloat(formValue.tasaMora) || 0,
            indLinea: formValue.indLinea || '',
            observaciones: formValue.observaciones || '',
            codEjecutivo: userCode, // Même utilisateur pour exécutif
            requisitos: (formValue.requisitos || []).map((id: string) => ({ codRequisito: id }) as RequisitoRequest)
        };

        this.state.set({ ...this.state(), submitting: true });

        // API call to create credit
        this.userService
            .miseEnPlaceCredit$(this.referenceCredit, creditRequest)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.set({ ...this.state(), submitting: false });

                    if (response.data && response.data.creditResponse && response.data.creditResponse.numCredito) {
                        this.creditNumber = response.data.creditResponse.numCredito;
                        this.showSuccessModal = true;

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: `Crédit créé avec succès. Numéro: ${this.creditNumber}`,
                            life: 5000
                        });
                    }
                },
                error: (error) => {
                    this.state.set({ ...this.state(), submitting: false });
                    console.error('Error creating credit:', error);

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: error.error?.message || 'Erreur lors de la création du crédit',
                        life: 5000
                    });
                }
            });
    }

    onModalClose(): void {
        this.showSuccessModal = false;
        // Redirect to credits list or other page
        this.router.navigate(['/dashboards/home']);
    }
}
