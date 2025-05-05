import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { PointVente } from '@/interface/point.vente';
import { IResponse } from '@/interface/response';
import { SG_USUARIOS } from '@/interface/sg_usuarios';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { switchMap, EMPTY, Observer } from 'rxjs';

@Component({
    selector: 'app-detail',
    imports: [
        InputTextModule,
        FluidModule,
        ButtonModule,
        SelectModule,
        FormsModule,
        TextareaModule,
        TableModule,
        DividerModule,
        IconFieldModule,
        InputIconModule,
        ProgressSpinnerModule,
        MessageModule,
        DropdownModule,
        ReactiveFormsModule,
        ToastModule
    ],
    templateUrl: './detail.component.html',
    providers: [MessageService]
})
export class DetailComponent {
    state = signal<{
        pointVentes?: PointVente[];
        pointVente?: PointVente;
        demandeIndividuel?: DemandeIndividuel;
        usuarios?: SG_USUARIOS[];
        loading: boolean;
        message: string | undefined;
        error: string | any;
        statusOptions: { label: string; value: string }[];
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        statusOptions: []
    });

    updateForm: FormGroup;
    private userService = inject(UserService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private fb = inject(FormBuilder);
    private messageService = inject(MessageService);

    constructor() {
        this.updateForm = this.fb.group({
            code: ['', Validators.required],
            usuario: ['', Validators.required],
            statut: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        this.loadDemandeInfo();
    }

    private loadDemandeInfo(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const demandeindividuel_id = params.get('demandeindividuel_id');
                    if (demandeindividuel_id) {
                        this.state.set({ ...this.state(), loading: true, message: undefined, error: undefined });
                        return this.userService.getDetailDemandeIndividuel$(+demandeindividuel_id);
                    } else {
                        this.state.set({ ...this.state(), loading: false, message: undefined, error: 'Invalide Code AgenceId or not exist' });
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe(this.getDetailIndividuel);
    }

    private getDetailIndividuel: Observer<IResponse> = {
        next: (response: IResponse) => {
            const agenceId = response.data.demandeIndividuel.agence;
            const pointvent_id = response.data.demandeIndividuel.pos;
            // Determine available status options based on current demande state
            const statusOptions: { label: string; value: string }[] = [];
            const demandeInfo = response.data.demandeIndividuel;

            if (demandeInfo.statutDemande === 'EN_ATTENTE' && demandeInfo.validationState === 'SELECTION') {
                statusOptions.push({ label: 'Validation', value: 'VALIDATION' });
            } else {
                statusOptions.push({ label: 'Validation', value: 'VALIDATION' });
            }
            this.state.set({
                ...this.state(),
                demandeIndividuel: response.data.demandeIndividuel,
                statusOptions: statusOptions,
                loading: false,
                message: response.message,
                error: undefined
            });

            // Load point de ventes for the agence
            this.loadPointVentes(agenceId);
            this.loadUniquePointVente(pointvent_id);
        },
        error: (error: string) => {
            this.state.set({ ...this.state(), loading: false, message: undefined, error: error });
        },
        complete: () => {}
    };

    private loadPointVentes(agenceId: number): void {
        this.userService
            .getAllPointVenteByAgenceId$(+agenceId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    this.state.set({ ...this.state(), pointVentes: response.data.pointVentes });
                },
                error: (error) => {
                    console.error('Error loading point de ventes:', error);
                }
            });
    }

    private loadUniquePointVente(pointvent_id: number): void {
        this.userService
            .getInfoPointService$(+pointvent_id)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('*** Point de vente Information *****');
                    console.log(response.data.pointVente);
                    this.state.set({ ...this.state(), pointVente: response.data.pointVente });
                },
                error: (error) => {
                    console.error('Error loading Unique Point de vente:', error);
                }
            });
    }

    onPointVenteChange(event: any): void {
        const selectedPointVente = event.value;
        this.updateForm.get('usuario')?.reset();

        if (selectedPointVente) {
            const codAgencia = selectedPointVente.code;
            const codPuesto = 'AGENCR'; // Default value
            const indActivo = 'A'; // Default value

            this.userService
                .getListUsuariosByCodAgencia$(codAgencia, codPuesto, indActivo)
                .pipe(takeUntilDestroyed(this.destroyRef))
                .subscribe({
                    next: (response: IResponse) => {
                        this.state.set({ ...this.state(), usuarios: response.data.usuarios });
                    },
                    error: (error) => {
                        console.error('Error loading usuarios:', error);
                    }
                });
        }
    }

    onSubmit(): void {
        if (this.updateForm.valid) {
            const { statut, usuario } = this.updateForm.value;
            const demandeIndividuelId = this.state().demandeIndividuel?.demandeindividuel_id;

            if (demandeIndividuelId && usuario) {
                this.state.set({ ...this.state(), loading: true });

                this.userService
                    .updateDemandeIndividuel$(statut, usuario.usariosPKId.codUsuarios, demandeIndividuelId)
                    .pipe(takeUntilDestroyed(this.destroyRef))
                    .subscribe({
                        next: (response: IResponse) => {
                            this.state.set({
                                ...this.state(),
                                loading: false,
                                message: 'Demande individuel updated successfully',
                                error: undefined
                            });

                            this.messageService.add({
                                severity: 'success',
                                summary: 'Success',
                                detail: 'Selection effectuée avec Success',
                                life: 3000
                            });

                            // Navigate after 3 seconds (matching the message life duration)
                            setTimeout(() => {
                                // Use the agence_id from the current state instead of the response
                                const agenceId = this.state().demandeIndividuel?.agence;
                                // If agenceId is available, navigate to the attente page
                                if (agenceId) {
                                    this.router.navigate(['/dashboards/credit/individuel/attente/', agenceId]);
                                } else {
                                    // Fallback navigation if agenceId is not available
                                    this.router.navigate(['/dashboards/credit/individuel/attente']);
                                }
                            }, 2000);
                        },
                        error: (error) => {
                            this.state.set({
                                ...this.state(),
                                loading: false,
                                message: undefined,
                                error: 'Error updating demande individuel'
                            });

                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Échec de la mise à jour',
                                life: 3000
                            });
                        }
                    });
            }
        } else {
            this.updateForm.markAllAsTouched();
        }
    }
}
