import { ChargeInd } from '@/interface/ChargeInd';
import { ClientesDto } from '@/interface/clientes-dto.model';
import { Garantiepersonnecaution } from '@/interface/Garantiepersonnecaution';
import { InstanceCreditView } from '@/interface/instance-credit-view';
import { NoteAnalyse } from '@/interface/note-analyse.model';
import { NoteGarantie } from '@/interface/note-garantie.model';
import { NoteProfile } from '@/interface/note-profile.model';
import { ProductInd } from '@/interface/ProductInd';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { TagModule } from 'primeng/tag';
import { TextareaModule } from 'primeng/textarea';
import { EMPTY, switchMap } from 'rxjs';
import { NoteProfileComponent } from './note-profile/note-profile.component';
import { NoteAnalyseComponent } from './note-analyse/note-analyse.component';
import { NoteGarantieComponent } from './note-garantie/note-garantie.component';
import { AppreciationComponent } from './appreciation/appreciation.component';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { NewCredit } from '@/interface/newCredit';
import { TypeCreditService } from '@/pages/service/type.credit.service';

@Component({
    selector: 'app-view-instance-credit-ind',
    imports: [
        CommonModule,
        TabViewModule,
        CardModule,
        TableModule,
        ProgressSpinnerModule,
        MessageModule,
        TagModule,
        ButtonModule,
        TextareaModule,
        ChipModule,
        ToastModule,
        NoteProfileComponent,
        NoteAnalyseComponent,
        NoteGarantieComponent,
        AppreciationComponent
    ],
    templateUrl: './view-instance-credit-ind.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ViewInstanceCreditIndComponent {
    // Add form groups
    analyseForm!: FormGroup;
    garantieForm!: FormGroup;
    public userId: number | null = null;
    state = signal<{
        instanceCreditInd?: InstanceCreditView;
        creditDto?: NewCredit;
        membre?: ClientesDto;
        charges?: ChargeInd[];
        products?: ProductInd[];
        garantieCaution?: Garantiepersonnecaution[];
        noteProfile?: NoteProfile;
        noteAnalyse?: NoteAnalyse;
        noteGarantie?: NoteGarantie;
        loading: boolean;
        submittingProfile: boolean;
        submittingAnalyse: boolean;
        submittingGarantie: boolean;
        message: string | undefined;
        error: string | any;
    }>({
        loading: false,
        submittingProfile: false,
        submittingAnalyse: false,
        submittingGarantie: false,
        message: undefined,
        error: undefined
    });

    private userService = inject(UserService);
    public router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private activatedRouter = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    public typeCreditService = inject(TypeCreditService);

    ngOnInit(): void {
        this.loadCreditNew();
    }

    // Méthode pour formater les montants en GNF
    formatMontantGNF(montant: number): string {
        if (!montant || montant === 0) return '0 GNF';
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'GNF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    }

    // Méthode pour obtenir l'état de complétude des notes
    getNotesCompletionStatus(): { completed: number; total: number; percentage: number } {
        const notes = [this.state().noteProfile, this.state().noteAnalyse, this.state().noteGarantie];
        const completed = notes.filter((note) => note).length;
        const total = 3;
        const percentage = Math.round((completed / total) * 100);
        return { completed, total, percentage };
    }

    // Méthode pour obtenir la couleur du statut de crédit
    getCreditStatusClass(status?: string): string {
        if (!status) return 'bg-gray-100 text-gray-800';

        switch (status.toUpperCase()) {
            case 'VALIDE':
                return 'bg-green-100 text-green-800';
            case 'ENCOURS':
                return 'bg-yellow-100 text-yellow-800';
            case 'REJECTED':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-blue-100 text-blue-800';
        }
    }

    submitAnalyseNote(): void {
        if (this.analyseForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs requis'
            });
            return;
        }

        const referenceCredit = this.state().instanceCreditInd?.referenceCredit;
        if (!referenceCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Référence de crédit manquante'
            });
            return;
        }

        if (!this.userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID utilisateur manquant'
            });
            return;
        }

        const noteAnalyse: NoteAnalyse = {
            ...this.analyseForm.value,
            referenceCredit,
            createdAt: new Date(),
            statusNote: 'ACTIVE',
            userId: this.userId
        };

        this.state.update((state) => ({ ...state, submittingAnalyse: true }));

        this.userService
            .addNoteAnalyse$(referenceCredit, noteAnalyse)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        submittingAnalyse: false,
                        noteAnalyse: noteAnalyse
                    }));

                    this.analyseForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: "Note d'analyse ajoutée avec succès"
                    });
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, submittingAnalyse: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de l'ajout de la note"
                    });
                }
            });
    }

    submitGarantieNote(): void {
        if (this.garantieForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs requis'
            });
            return;
        }

        const referenceCredit = this.state().instanceCreditInd?.referenceCredit;
        if (!referenceCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Référence de crédit manquante'
            });
            return;
        }

        if (!this.userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'ID utilisateur manquant'
            });
            return;
        }

        const noteGarantie: NoteGarantie = {
            ...this.garantieForm.value,
            referenceCredit,
            createdAt: new Date(),
            statusNote: 'ACTIVE',
            userId: this.userId
        };

        this.state.update((state) => ({ ...state, submittingGarantie: true }));

        this.userService
            .addNoteGarantie$(referenceCredit, noteGarantie)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        submittingGarantie: false,
                        noteGarantie: noteGarantie
                    }));

                    this.garantieForm.reset();
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Note de garantie ajoutée avec succès'
                    });
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, submittingGarantie: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de l'ajout de la note"
                    });
                }
            });
    }

    private loadCreditNew(): void {
        this.activatedRouter.paramMap
            .pipe(
                switchMap((params: ParamMap) => {
                    const referenceCredit = params.get('referenceCredit');
                    const numeroMembre = params.get('numeroMembre');
                    const userId = params.get('userId');

                    this.userId = userId ? +userId : null;

                    if (referenceCredit) {
                        this.state.update((state) => ({ ...state, loading: true, message: undefined, error: undefined }));
                        return this.userService.viewInstanceCredit$(referenceCredit, numeroMembre!, +userId!);
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
                        instanceCreditInd: response.data?.instanceCreditInd,
                        creditDto: response.data?.creditDto,
                        referenceCredit: response.data?.creditDto?.referenceCredit,
                        membre: response.data?.membre,
                        charges: response.data?.charges || [],
                        products: response.data?.products || [],
                        garantieCaution: response.data?.garantieCaution || [],
                        noteProfile: response.data?.noteProfile,
                        noteAnalyse: response.data?.noteAnalyse,
                        noteGarantie: response.data?.noteGarantie,
                        loading: false,
                        message: response.message,
                        error: undefined
                    }));
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

    getStatusSeverity(status?: string): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' | undefined {
        if (!status) return 'info';

        switch (status.toUpperCase()) {
            case 'ACTIVE':
            case 'APPROUVE':
                return 'success';
            case 'EN_ATTENTE':
                return 'warn';
            case 'INACTIVE':
            case 'REJETE':
                return 'danger';
            default:
                return 'info';
        }
    }

    getCreditStateSeverity(state?: string): 'success' | 'info' | 'warn' | 'secondary' | 'contrast' | 'danger' | undefined {
        if (!state) return 'info';

        switch (state.toUpperCase()) {
            case 'VALIDE':
                return 'success';
            case 'ENCOURS':
                return 'warn';
            case 'REJECTED':
                return 'danger';
            default:
                return 'info';
        }
    }

    calculateProductTotal(): number {
        if (!this.state().products?.length) return 0;
        return this.state().products!.reduce((total, product) => {
            return total + (product.prix_unit! || 0) * (product.qte || 0);
        }, 0);
    }

    calculateChargeTotal(): number {
        if (!this.state().charges?.length) return 0;
        return this.state().charges!.reduce((total, charge) => {
            return total + (charge.prix_unit || 0) * (charge.qte || 0);
        }, 0);
    }

    calculateNetTotal(): number {
        return this.calculateProductTotal() - this.calculateChargeTotal();
    }

    handleProfileNote(note: NoteProfile | undefined): void {
        if (!note) {
            this.state.update((state) => ({ ...state, noteProfile: undefined }));
            return;
        }

        const referenceCredit = this.state().instanceCreditInd?.referenceCredit;
        if (!referenceCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Référence de crédit manquante'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submittingProfile: true }));

        this.userService
            .addNoteProfile$(referenceCredit, note)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        submittingProfile: false,
                        noteProfile: response.data.noteProfile,
                        noteAnalyse: response.data.noteAnalyse,
                        noteGarantie: response.data.noteGarantie
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Note de profil ajoutée avec succès'
                    });
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, submittingProfile: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de l'ajout de la note"
                    });
                }
            });
    }

    handleAnalyseNote(note: NoteAnalyse | undefined): void {
        if (!note) {
            this.state.update((state) => ({ ...state, noteAnalyse: undefined }));
            return;
        }

        const referenceCredit = this.state().instanceCreditInd?.referenceCredit;
        if (!referenceCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Référence de crédit manquante'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submittingAnalyse: true }));

        this.userService
            .addNoteAnalyse$(referenceCredit, note)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        submittingAnalyse: false,
                        noteProfile: response.data.noteProfile,
                        noteAnalyse: response.data.noteAnalyse,
                        noteGarantie: response.data.noteGarantie
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: "Note d'analyse ajoutée avec succès"
                    });
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, submittingAnalyse: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de l'ajout de la note"
                    });
                }
            });
    }

    handleGarantieNote(note: NoteGarantie | undefined): void {
        if (!note) {
            this.state.update((state) => ({ ...state, noteGarantie: undefined }));
            return;
        }

        const referenceCredit = this.state().instanceCreditInd?.referenceCredit;
        if (!referenceCredit) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Référence de crédit manquante'
            });
            return;
        }

        this.state.update((state) => ({ ...state, submittingGarantie: true }));

        this.userService
            .addNoteGarantie$(referenceCredit, note)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((state) => ({
                        ...state,
                        submittingGarantie: false,
                        noteProfile: response.data.noteProfile,
                        noteAnalyse: response.data.noteAnalyse,
                        noteGarantie: response.data.noteGarantie
                    }));

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: 'Note de garantie ajoutée avec succès'
                    });
                },
                error: (error) => {
                    this.state.update((state) => ({ ...state, submittingGarantie: false }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: typeof error === 'string' ? error : "Une erreur s'est produite lors de l'ajout de la note"
                    });
                }
            });
    }

    showAppreciationTab(): boolean {
        return !!(this.state().noteProfile && this.state().noteAnalyse && this.state().noteGarantie);
    }

    // Méthode pour rafraîchir les données
    refreshData(): void {
        this.loadCreditNew();
        this.messageService.add({
            severity: 'info',
            summary: 'Actualisation',
            detail: 'Données actualisées avec succès',
            life: 2000
        });
    }
}
