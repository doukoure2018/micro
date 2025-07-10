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
import { TabViewModule } from 'primeng/tabview';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { switchMap, EMPTY, finalize } from 'rxjs';

import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { ProcessCreditInd } from '@/interface/process.credit.ind';
import { NewCredit } from '@/interface/newCredit';
@Component({
    selector: 'app-process-update-credit',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, CardModule, TabViewModule, ToastModule, ConfirmDialogModule, ProgressSpinnerModule, AvatarModule, TagModule],
    templateUrl: './process-update-credit.component.html',
    styleUrls: ['./process-update-credit.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class ProcessUpdateCreditComponent {
    state = signal<{
        creditDto?: NewCredit;
        creditData?: any;
        produits?: any[];
        charges?: any[];
        cautions?: any[];
        referenceCredit?: string;
        individuelId?: number;
        loading: boolean;
        message: string | undefined;
        error: string | any;
        activeIndex: number;
        submitLoading: boolean;
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
            creance: [0, [Validators.min(0)]],
            dette: [0, [Validators.min(0)]],
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
        this.loadCreditData();
    }

    private loadCreditData(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const referenceCredit = params.get('referenceCredit');
                    if (referenceCredit) {
                        this.state.update((state) => ({
                            ...state,
                            loading: true,
                            message: undefined,
                            error: undefined,
                            referenceCredit
                        }));
                        return this.userService.getCreditDataDetailed$(referenceCredit);
                    } else {
                        this.state.update((state) => ({
                            ...state,
                            loading: false,
                            message: undefined,
                            error: 'Référence de crédit invalide'
                        }));
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
                        creditData: response.data.creditData,
                        produits: response.data.products,
                        charges: response.data.charges,
                        cautions: response.data.cautions,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));

                    // Préremplir le formulaire avec les données existantes
                    this.populateForm();
                },
                error: (error: string) => {
                    this.state.update((state) => ({
                        ...state,
                        loading: false,
                        message: undefined,
                        error
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors du chargement des données"
                    });
                }
            });
    }

    private populateForm(): void {
        const { creditDto, creditData, produits, charges, cautions } = this.state();

        if (!creditData) return;

        // Remplir les champs principaux
        this.creditForm.patchValue({
            numeroMembre: creditDto?.codeMembre || '',
            referenceCredit: creditData.referenceCredit || '',
            cumulCredit: creditData.cumulCredit || 0,
            nbreCredit: creditData.nbreCredit || 0,
            moyenPerson: creditData.moyenPerson || '',
            bien: creditData.bien || '',
            capital: creditData.capital || 0,
            creance: creditData.creance || 0,
            dette: creditData.dette || 0,
            statutActivite: creditData.statutActivite || '',
            experience: creditData.experience || '',
            lieuxAct: creditData.lieuxAct || '',
            personEmp: creditData.personEmp || '',
            lien: creditData.lien || '',
            nombre: creditData.nombre || '',
            frequence: creditData.frequenceValue || 0,
            garantieLibele: creditData.garantieLibele || '',
            garantieMontant: creditData.garantieMontant || 0,
            itAss: creditData.itAss || '',
            itPc: creditData.itPc || ''
        });

        // Extraire l'individuelId depuis le creditData si disponible
        if (creditData.individuelId) {
            this.state.update((state) => ({ ...state, individuelId: creditData.individuelId }));
        }

        // Remplir les FormArrays
        this.populateProductsArray(produits || []);
        this.populateChargesArray(charges || []);
        this.populateCautionsArray(cautions || []);
    }

    private populateProductsArray(produits: any[]): void {
        const produitsArray = this.creditForm.get('produits') as FormArray;
        produitsArray.clear();

        if (produits.length === 0) {
            this.addProduit();
        } else {
            produits.forEach((produit) => {
                const produitGroup = this.fb.group({
                    libele: [produit.libele || '', Validators.required],
                    prixUnit: [produit.prix_unit || 0, [Validators.required, Validators.min(0)]],
                    qte: [produit.qte || 0, [Validators.required, Validators.min(1)]],
                    observation: [produit.observation || '']
                });
                produitsArray.push(produitGroup);
            });
        }
    }

    private populateChargesArray(charges: any[]): void {
        const chargesArray = this.creditForm.get('charges') as FormArray;
        chargesArray.clear();

        if (charges.length === 0) {
            this.addCharge();
        } else {
            charges.forEach((charge) => {
                const chargeGroup = this.fb.group({
                    libele: [charge.libele || '', Validators.required],
                    prixUnit: [charge.prix_unit || 0, [Validators.required, Validators.min(0)]],
                    qte: [charge.qte || 0, [Validators.required, Validators.min(1)]]
                });
                chargesArray.push(chargeGroup);
            });
        }
    }

    private populateCautionsArray(cautions: any[]): void {
        const cautionsArray = this.creditForm.get('cautions') as FormArray;
        cautionsArray.clear();

        if (cautions.length === 0) {
            this.addCaution();
        } else {
            cautions.forEach((caution) => {
                const cautionGroup = this.fb.group({
                    nom: [caution.nom || '', Validators.required],
                    prenom: [caution.prenom || '', Validators.required],
                    telephone: [caution.telephone || '', Validators.required],
                    activite: [caution.activite || '', Validators.required],
                    age: [caution.age || 0, [Validators.required, Validators.min(18)]],
                    profession: [caution.profession || '', Validators.required]
                });
                cautionsArray.push(cautionGroup);
            });
        }
    }

    // Méthodes identiques au composant d'insertion
    isFormValid(): boolean {
        if (this.creditForm.invalid) {
            return false;
        }

        for (let produit of this.produits.controls) {
            if (produit.get('libele')?.invalid || produit.get('prixUnit')?.invalid || produit.get('qte')?.invalid) {
                return false;
            }
        }

        for (let charge of this.charges.controls) {
            if (charge.get('libele')?.invalid || charge.get('prixUnit')?.invalid || charge.get('qte')?.invalid) {
                return false;
            }
        }

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

    // Tab handling
    onActiveIndexChange(event: number): void {
        this.state.update((state) => ({ ...state, activeIndex: event }));
    }

    nextStep(): void {
        this.state.update((state) => ({ ...state, activeIndex: state.activeIndex + 1 }));
    }

    prevStep(): void {
        this.state.update((state) => ({ ...state, activeIndex: state.activeIndex - 1 }));
    }

    // Méthode de mise à jour du crédit
    public updateCreditData(): void {
        if (!this.isFormValid()) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir tous les champs obligatoires.'
            });
            return;
        }

        const formValue = this.creditForm.value;
        const referenceCredit = this.state().referenceCredit!;
        const individuelId = this.state().individuelId || 1; // Valeur par défaut si non trouvée

        // Préparer les données pour l'API
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

            // Convertir les FormArrays en arrays plats pour le backend
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
            message: 'Êtes-vous sûr de vouloir mettre à jour ce crédit?',
            header: 'Confirmation de mise à jour',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.state.update((state) => ({ ...state, submitLoading: true }));

                this.userService
                    .updateCreditDataPartial$(referenceCredit, individuelId, creditProcessParams)
                    .pipe(
                        takeUntilDestroyed(this.destroyRef),
                        finalize(() => this.state.update((state) => ({ ...state, submitLoading: false })))
                    )
                    .subscribe({
                        next: (response: IResponse) => {
                            this.messageService.add({
                                severity: 'success',
                                summary: 'Succès',
                                detail: response.message || 'Crédit mis à jour avec succès'
                            });

                            // Naviguer vers une page de succès ou tableau de bord
                            setTimeout(() => {
                                this.router.navigate(['/dashboards/home']);
                            }, 1500);
                        },
                        error: (error: any) => {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Erreur',
                                detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de la mise à jour du crédit"
                            });
                        }
                    });
            }
        });
    }

    // Calculate totals
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
