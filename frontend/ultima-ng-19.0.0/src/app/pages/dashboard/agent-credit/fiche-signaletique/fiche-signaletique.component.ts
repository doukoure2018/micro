import { Individuel } from '@/interface/individuel';
import { IResponse } from '@/interface/response';
import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { User } from '@/types/user';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FluidModule } from 'primeng/fluid';
import { IconFieldModule } from 'primeng/iconfield';
import { ImageModule } from 'primeng/image';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { EMPTY, map, switchMap, tap } from 'rxjs';
@Component({
    selector: 'app-fiche-signaletique',
    imports: [
        CommonModule,
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
        ToastModule,
        ImageModule,
        CardModule,
        InputNumberModule,
        CalendarModule
    ],
    templateUrl: './fiche-signaletique.component.html',
    providers: [MessageService, ConfirmationService],
    standalone: true
})
export class FicheSignaletiqueComponent {
    state = signal<{
        user?: IUser;
        individuel?: Individuel;
        loading: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        message: undefined,
        error: undefined
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
            catMembre: ['', Validators.required],
            numeroMembre: ['', Validators.required],
            nom: ['', [Validators.required, Validators.maxLength(25)]],
            prenom: ['', [Validators.required, Validators.maxLength(25)]],
            dateNaissance: [null, Validators.required],
            lieuxNaissance: ['', [Validators.required, Validators.maxLength(25)]],
            nationalite: ['', [Validators.required, Validators.maxLength(25)]],
            telephone: ['', [Validators.required, Validators.pattern(/^\+?[0-9]{8,15}$/)]],
            telephone2: ['', Validators.pattern(/^\+?[0-9]{8,15}$/)],
            typePiece: ['', Validators.required],
            numeroPiece: ['', Validators.required],
            sexe: ['', Validators.required],
            profession: ['', [Validators.required, Validators.maxLength(255)]],
            nomPere: ['', Validators.maxLength(25)],
            nomMere: ['', Validators.maxLength(25)],
            activite: ['', Validators.maxLength(255)],
            nbreEnfant: [0, Validators.min(0)],
            nbreParent: [0, Validators.min(0)],
            nbreAutre: [0, Validators.min(0)],
            quartier: ['', Validators.maxLength(255)],
            district: ['', Validators.maxLength(255)],
            secteur: ['', Validators.maxLength(255)],
            cotisation: [0, Validators.min(0)],
            droitEntree: [0, Validators.min(0)],
            typeHabitation: [''],
            nbreAnnee: [0, Validators.min(0)],
            statutIndividuel: [''],
            prestataire: [''],
            codCanton: [''],
            ville: ['', Validators.maxLength(255)],
            typeEntreprise: [''],
            lienParente: [''],
            nomParent: [''],
            conjoint: [''],
            nbreAnneeH: [0, Validators.min(0)],
            adresse: ['', Validators.maxLength(255)]
        });
    }

    ngOnInit(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const numeroMembre = params.get('numeroMembre');
                    if (numeroMembre) {
                        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));

                        // Modify this part to map the IResponse to IUser
                        return this.userService.getInstanceUser$().pipe(
                            // Map the response to extract the user
                            map((response: IResponse) => response.data?.user as IUser),
                            // Now we have an IUser to work with
                            tap((user: IUser | undefined) => {
                                if (user) {
                                    this.state.update((state) => ({ ...state, user }));
                                    this.updateForm.get('numeroMembre')?.setValue(numeroMembre);
                                } else {
                                    throw new Error('User data not found in response');
                                }
                            })
                        );
                    } else {
                        this.state.update((state) => ({ ...state, loading: false, message: undefined, error: 'Invalid numeroMembre' }));
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: 'Invalid member number'
                        });
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: () => {
                    this.state.update((state) => ({ ...state, loading: false }));
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, loading: false, error: error.message || 'Failed to load user data' }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Failed to load user data'
                    });
                }
            });
    }

    onSubmit(): void {
        if (this.updateForm.invalid) {
            this.markFormGroupTouched(this.updateForm);
            this.messageService.add({
                severity: 'error',
                summary: 'Validation Error',
                detail: 'Please fill all required fields correctly'
            });
            return;
        }

        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));

        const formData = this.updateForm.value;
        const individuelData: Individuel = {
            ...formData,
            // Ensure userId is set from the current user
            userId: this.state().user?.userId || 0,
            // Set created date
            createdAt: new Date()
        };

        // Get the member number from the form
        const numeroMembre = this.updateForm.get('numeroMembre')?.value;

        // Call the API to add the individuel
        this.userService
            .addFicherSignaletique$(individuelData, numeroMembre)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    // Extract the individuel from the response data
                    const individuel = response.data?.individuel;

                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: 'Member created successfully',
                        individuel: individuel
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Member created successfully'
                    });

                    // Navigate back to list after successful save
                    setTimeout(() => {
                        this.router.navigate(['/individuels']);
                    }, 1500);
                },
                error: (error) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        error: error.message || 'Failed to create member'
                    }));

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: error.message || 'Failed to create member'
                    });
                }
            });
    }

    // Helper method to mark all form controls as touched
    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.values(formGroup.controls).forEach((control) => {
            control.markAsTouched();
            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    // Reset form
    resetForm(): void {
        this.updateForm.reset();

        // Set default values
        this.updateForm.patchValue({
            nbreEnfant: 0,
            nbreParent: 0,
            nbreAutre: 0,
            cotisation: 0,
            droitEntree: 0,
            nbreAnnee: 0,
            nbreAnneeH: 0
        });
    }

    // Cancel and go back
    cancelEdit(): void {
        this.router.navigate(['/individuels']);
    }
}
