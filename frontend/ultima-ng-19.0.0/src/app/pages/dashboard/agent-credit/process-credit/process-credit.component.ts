import { NewCredit } from '@/interface/newCredit';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { switchMap, EMPTY, finalize } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { ProcessCreditInd } from '@/interface/process.credit.ind';

@Component({
    selector: 'app-process-credit',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, CardModule, TabViewModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule],
    templateUrl: './process-credit.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ProcessCreditComponent {
    state = signal<{
        creditDto?: NewCredit;
        referenceCredit?: string;
        userId?: number;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        activeIndex: number;
        submitLoading: boolean;
        cumulCredit?: number;
        countCredit?: number;
    }>({
        loading: false,
        message: undefined,
        error: undefined,
        activeIndex: 0,
        submitLoading: false
    });

    // Forms
    creditForm: FormGroup;

    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private fb = inject(FormBuilder);

    constructor() {
        this.creditForm = this.fb.group({
            numeroMembre: ['', Validators.required],
            referenceCredit: ['', Validators.required],
            cumulCredit: [0, [Validators.min(0)]],
            nbreCredit: [0, [Validators.min(0)]],
            moyenPerson: ['', Validators.required],
            bien: ['', Validators.required],
            capital: [0, [Validators.required, Validators.min(0)]],
            creance: [0, [Validators.min(0)]], // Enlever Validators.required
            dette: [0, [Validators.min(0)]], // Enlever Validators.required
            statutActivite: ['', Validators.required],
            experience: ['', Validators.required],
            lieuxAct: ['', Validators.required],
            personEmp: [''],
            lien: [''],
            nombre: [''],
            frequence: [0, [Validators.required, Validators.min(0)]],
            garantieLibele: ['', Validators.required],
            garantieMontant: [0, [Validators.required, Validators.min(0)]],
            itAss: [''],
            itPc: [''],
            produits: this.fb.array([]),
            charges: this.fb.array([]),
            cautions: this.fb.array([])
        });
    }

    ngOnInit(): void {
        this.loadInstanceCredit();
        // Add initial empty items
        this.addProduit();
        this.addCharge();
        this.addCaution();
    }

    private loadInstanceCredit(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const numeroMembre = params.get('numeroMembre');
                    const userId = params.get('userId');
                    if (numeroMembre && userId) {
                        this.state.update((state) => ({ ...state, userId: Number(userId), loading: true, message: undefined, error: undefined }));
                        return this.userService.getInstanceCredit$(numeroMembre);
                    } else {
                        this.state.update((state) => ({ ...state, loading: false, message: undefined, error: 'Invalide NumeroMembre' }));
                        return EMPTY;
                    }
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (response: IResponse) => {
                    this.state.update((state) => ({
                        ...state,
                        creditDto: response.data.creditDto,
                        referenceCredit: response.data.creditDto?.referenceCredit,
                        cumulCredit: response.data.cumulCredit,
                        countCredit: response.data.countCredit,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));

                    // Populate the form with the initial data
                    this.populateForm(response.data.creditDto!, response.data.cumulCredit!, response.data.countCredit!);
                },
                error: (error: string) => {
                    this.state.update((state) => ({ ...state, loading: false, message: undefined, error }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors du chargement des données"
                    });
                }
            });
    }

    private populateForm(creditDto: NewCredit, cumulCredit: number, countCredit: number): void {
        if (!creditDto) return;

        this.creditForm.patchValue({
            numeroMembre: creditDto.codeMembre,
            referenceCredit: creditDto.referenceCredit,
            cumulCredit: cumulCredit,
            nbreCredit: countCredit
            // Patch other available fields here
        });
    }

    // Méthode pour vérifier si le formulaire est valide (tous les champs obligatoires remplis)
    isFormValid(): boolean {
        if (this.creditForm.invalid) {
            return false;
        }

        // Vérifier que tous les produits ont des champs obligatoires remplis
        for (let produit of this.produits.controls) {
            if (produit.get('libele')?.invalid || produit.get('prixUnit')?.invalid || produit.get('qte')?.invalid) {
                return false;
            }
        }

        // Vérifier que toutes les charges ont des champs obligatoires remplis
        for (let charge of this.charges.controls) {
            if (charge.get('libele')?.invalid || charge.get('prixUnit')?.invalid || charge.get('qte')?.invalid) {
                return false;
            }
        }

        // Vérifier que toutes les cautions ont des champs obligatoires remplis
        for (let caution of this.cautions.controls) {
            if (caution.get('nom')?.invalid || caution.get('prenom')?.invalid || caution.get('telephone')?.invalid || caution.get('activite')?.invalid || caution.get('age')?.invalid || caution.get('profession')?.invalid) {
                return false;
            }
        }

        return true;
    }

    // Form array accessors
    get produits(): FormArray {
        return this.creditForm.get('produits') as FormArray;
    }

    get charges(): FormArray {
        return this.creditForm.get('charges') as FormArray;
    }

    get cautions(): FormArray {
        return this.creditForm.get('cautions') as FormArray;
    }

    // Add new form groups
    addProduit(): void {
        const produitGroup = this.fb.group({
            libele: ['', Validators.required],
            prixUnit: [0, [Validators.required, Validators.min(0)]],
            qte: [0, [Validators.required, Validators.min(1)]],
            observation: ['']
        });
        this.produits.push(produitGroup);
    }

    addCharge(): void {
        const chargeGroup = this.fb.group({
            libele: ['', Validators.required],
            prixUnit: [0, [Validators.required, Validators.min(0)]],
            qte: [0, [Validators.required, Validators.min(1)]]
        });
        this.charges.push(chargeGroup);
    }

    addCaution(): void {
        const cautionGroup = this.fb.group({
            nom: ['', Validators.required],
            prenom: ['', Validators.required],
            telephone: ['', Validators.required],
            activite: ['', Validators.required],
            age: [0, [Validators.required, Validators.min(18)]],
            profession: ['', Validators.required]
        });
        this.cautions.push(cautionGroup);
    }

    // Remove form groups
    removeProduit(index: number): void {
        this.produits.removeAt(index);
    }

    removeCharge(index: number): void {
        this.charges.removeAt(index);
    }

    removeCaution(index: number): void {
        this.cautions.removeAt(index);
    }

    // Tab handling with activeTabChange
    onActiveIndexChange(event: number): void {
        this.state.update((state) => ({ ...state, activeIndex: event }));
    }

    // Navigation between steps
    nextStep(): void {
        this.state.update((state) => ({ ...state, activeIndex: state.activeIndex + 1 }));
    }

    prevStep(): void {
        this.state.update((state) => ({ ...state, activeIndex: state.activeIndex - 1 }));
    }

    public processCreditInd(): void {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires.'
            });
            return;
        }

        const formValue = this.creditForm.value;
        const referenceCredit = formValue.referenceCredit;

        // Prepare the data for API
        const creditProcessParams: ProcessCreditInd = {
            numeroMembre: formValue.numeroMembre,
            referenceCredit: formValue.referenceCredit,
            moyenPerson: formValue.moyenPerson,
            bien: formValue.bien,
            capital: formValue.capital,
            creance: formValue.creance,
            dette: formValue.dette,
            statutActivite: formValue.statutActivite,
            experience: formValue.experience,
            lieuxAct: formValue.lieuxAct,
            personEmp: formValue.personEmp,
            lien: formValue.lien,
            nombre: formValue.nombre,
            cumulCredit: formValue.cumulCredit,
            nbreCredit: formValue.nbreCredit,
            frequence: formValue.frequence,
            garantieLibele: formValue.garantieLibele,
            garantieMontant: formValue.garantieMontant,
            itAss: formValue.itAss,
            itPc: formValue.itPc,

            // Convert form arrays to flat arrays for the backend
            produitsLibele: formValue.produits.map((p: any) => p.libele),
            produitsPrixUnit: formValue.produits.map((p: any) => p.prixUnit),
            produitsQte: formValue.produits.map((p: any) => p.qte),
            produitsObservation: formValue.produits.map((p: any) => p.observation),

            chargesLibele: formValue.charges.map((c: any) => c.libele),
            chargesPrixUnit: formValue.charges.map((c: any) => c.prixUnit),
            chargesQte: formValue.charges.map((c: any) => c.qte),

            cautionsNom: formValue.cautions.map((c: any) => c.nom),
            cautionsPrenom: formValue.cautions.map((c: any) => c.prenom),
            cautionsTelephone: formValue.cautions.map((c: any) => c.telephone),
            cautionsActivite: formValue.cautions.map((c: any) => c.activite),
            cautionsAge: formValue.cautions.map((c: any) => c.age),
            cautionsProfession: formValue.cautions.map((c: any) => c.profession)
        };

        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir valider ce crédit?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.state.update((state) => ({ ...state, submitLoading: true }));

                this.userService
                    .processCreditInd$(referenceCredit, creditProcessParams, this.state().userId!, this.state().creditDto?.individuelId!)
                    .pipe(
                        takeUntilDestroyed(this.destroyRef),
                        finalize(() => this.state.update((state) => ({ ...state, submitLoading: false })))
                    )
                    .subscribe({
                        next: (response: IResponse) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: response.message || 'Crédit traité avec succès'
                            });

                            // Navigate to a success page or dashboard
                            setTimeout(() => {
                                this.router.navigate(['/dashboards/home']);
                            }, 1500);
                        },
                        error: (error: any) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: typeof error === 'string' ? error : "Une erreur s'est produite lors du traitement du crédit"
                            });
                        }
                    });
            }
        });
    }

    // Calculate total for all products
    calculateTotalProduits(): number {
        let total = 0;

        if (this.produits && this.produits.length) {
            this.produits.controls.forEach((control) => {
                const prix = control.get('prixUnit')?.value || 0;
                const qte = control.get('qte')?.value || 0;
                total += prix * qte;
            });
        }

        return total;
    }

    // Calculate total for all charges
    calculateTotalCharges(): number {
        let total = 0;

        if (this.charges && this.charges.length) {
            this.charges.controls.forEach((control) => {
                const prix = control.get('prixUnit')?.value || 0;
                const qte = control.get('qte')?.value || 0;
                total += prix * qte;
            });
        }

        return total;
    }
}
