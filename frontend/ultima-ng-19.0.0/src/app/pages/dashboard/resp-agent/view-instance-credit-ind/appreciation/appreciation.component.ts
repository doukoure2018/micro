import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Appreciation } from '@/interface/appreciation';
import { UserService } from '@/service/user.service';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { TableModule } from 'primeng/table';
import { ResultNote } from '@/interface/result.note';
import { Router } from '@angular/router';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
    selector: 'app-appreciation',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, CardModule, ButtonModule, InputTextModule, InputNumberModule, TextareaModule, TextareaModule, TabViewModule, TableModule, ConfirmDialogModule, ToastModule],
    templateUrl: './appreciation.component.html',
    providers: [MessageService, ConfirmationService]
})
export class AppreciationComponent {
    // Define constants
    private static readonly DEFAULT_THRESHOLD: number = 7.5;
    private static readonly MAX_SCORE: number = 15;
    @Input() referenceCredit?: string;
    @Input() userId?: number;
    @Input() montantDemande?: number;

    appreciationForm!: FormGroup;
    calculating: boolean = false;
    resultNote?: ResultNote;

    // Expose constants to template
    readonly maxScore = AppreciationComponent.MAX_SCORE;

    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);
    private router = inject(Router);

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.appreciationForm = this.fb.group({
            motif: ['', Validators.required],
            montantSuggere: [null, [Validators.required, Validators.min(0)]],
            montantDemande: [{ value: this.montantDemande, disabled: true }] // Prefilled and disabled
        });
    }

    confirmSubmission(): void {
        if (this.appreciationForm.invalid) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Veuillez remplir correctement tous les champs requis'
            });
            return;
        }

        // Show confirmation dialog
        this.confirmationService.confirm({
            message: 'Êtes-vous sûr de vouloir finaliser cette évaluation de crédit?',
            header: 'Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.submitAppreciation();
            }
        });
    }

    private submitAppreciation(): void {
        if (!this.referenceCredit || !this.userId) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: 'Informations de référence manquantes'
            });
            return;
        }

        // Use the constant threshold value
        const threshold = AppreciationComponent.DEFAULT_THRESHOLD;

        const appreciation: Appreciation = {
            motif: this.appreciationForm.get('motif')?.value,
            montantSuggere: this.appreciationForm.get('montantSuggere')?.value,
            montantDemande: this.montantDemande,
            referenceCredit: this.referenceCredit,
            userId: this.userId,
            createdAt: new Date()
        };

        this.calculating = true;

        this.userService.calculateNotesAndUpdateCredit(threshold, appreciation).subscribe({
            next: (response) => {
                this.calculating = false;
                this.resultNote = response.data.resultNote;

                // Show success toast
                this.messageService.add({
                    severity: 'success',
                    summary: 'Succès',
                    detail: `Évaluation de crédit complétée avec succès. Statut: ${this.resultNote?.newStatus === 'ACCEPTED' ? 'ACCEPTÉ' : 'REJETÉ'}`
                });

                // Disable the form after successful submission
                this.appreciationForm.disable();

                // Show navigation confirmation after 2 seconds
                setTimeout(() => {
                    this.confirmNavigation();
                }, 2000);
            },
            error: (error) => {
                this.calculating = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erreur',
                    detail: typeof error === 'string' ? error : "Une erreur s'est produite lors du calcul"
                });
            }
        });
    }

    confirmNavigation(): void {
        this.confirmationService.confirm({
            message: 'Souhaitez-vous retourner au tableau de bord?',
            header: 'Navigation',
            icon: 'pi pi-home',
            accept: () => {
                this.navigateToDashboard();
            }
        });
    }

    navigateToDashboard(): void {
        this.router.navigate(['/dashboard/home']);
    }

    resetForm(): void {
        this.appreciationForm.reset({
            montantDemande: this.montantDemande
        });
        this.appreciationForm.enable();
        // Keep montantDemande disabled
        this.appreciationForm.get('montantDemande')?.disable();
        this.resultNote = undefined;
    }
}
