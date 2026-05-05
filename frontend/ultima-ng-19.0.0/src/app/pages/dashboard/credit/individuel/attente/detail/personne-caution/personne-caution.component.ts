import { Personnecaution } from '@/interface/personnecaution';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-personne-caution',
    imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonModule, InputTextModule, InputNumberModule, CardModule, ToastModule, TextareaModule, TooltipModule, ProgressSpinnerModule],
    templateUrl: './personne-caution.component.html',
    providers: [MessageService]
})
export class PersonneCautionComponent {
    private fb = inject(FormBuilder);
    private router = inject(Router);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private http = inject(HttpClient);

    private apiUrl = environment.apiBaseUrl;

    demandeIndividuelId: number | null = null;
    personnecautions: Personnecaution[] = [];
    personnecautionForm!: FormGroup;
    loading = signal<boolean>(false);
    saving = signal<boolean>(false);

    ngOnInit(): void {
        this.initForm();
        this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            const id = params.get('demandeindividuelId');
            if (id) {
                this.demandeIndividuelId = +id;
                this.loadExistingCautions();
            }
        });
    }

    /** Telephone guinéen: +224 suivi de 9 chiffres */
    private static readonly PHONE_GUINEE_REGEX = /^\+224[0-9]{9}$/;

    private initForm(): void {
        this.personnecautionForm = this.fb.group({
            nom: [''],
            prenom: [''],
            telephone: ['+224', [Validators.pattern(PersonneCautionComponent.PHONE_GUINEE_REGEX)]],
            activite: [''],
            age: [null],
            profession: [''],
            adresseComplete: [''],
            descriptionActivite: ['']
        });
    }

    /**
     * Normalise la saisie du telephone en format guinéen.
     * - Conserve uniquement chiffres + caractere '+' au debut
     * - Auto-prefixe avec +224 si l'utilisateur efface le prefixe
     * - Limite a +224 + 9 chiffres
     */
    onTelephoneInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        let value = input.value;

        // Garde le '+' uniquement en première position
        const hasPlus = value.startsWith('+');
        value = value.replace(/[^\d]/g, '');
        if (hasPlus) value = '+' + value;

        // Si l'utilisateur a tape sans prefixe ou s'il a tape un autre indicatif, force +224
        if (!value.startsWith('+224')) {
            // S'il a juste tape des chiffres, prepend +224
            const digits = value.replace(/^\+?224?/, '').replace(/\D/g, '');
            value = '+224' + digits;
        }

        // Limiter a 9 chiffres apres +224
        const after = value.substring(4).replace(/\D/g, '');
        value = '+224' + after.substring(0, 9);

        this.personnecautionForm.get('telephone')?.setValue(value, { emitEvent: false });
        input.value = value;
    }

    /** Indicateur pour afficher l'erreur de format dans le template */
    isTelephoneInvalid(): boolean {
        const ctrl = this.personnecautionForm.get('telephone');
        if (!ctrl || !ctrl.value || ctrl.value === '+224') return false;
        return ctrl.invalid && (ctrl.touched || ctrl.dirty);
    }

    private loadExistingCautions(): void {
        if (!this.demandeIndividuelId) return;
        this.loading.set(true);
        this.http
            .get<any>(`${this.apiUrl}/ecredit/bilan_finance/synthese/demande/${this.demandeIndividuelId}`)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.loading.set(false);
                    const cautions = response?.data?.personnesCaution;
                    if (cautions && Array.isArray(cautions) && cautions.length > 0) {
                        this.personnecautions = cautions.map((c: any) => ({
                            personnecautionId: c.personnecautionId,
                            nom: c.nom || '',
                            prenom: c.prenom || '',
                            telephone: c.telephone || '',
                            activite: c.activite || '',
                            age: c.age || null,
                            profession: c.profession || '',
                            adresseComplete: c.adresseComplete || '',
                            descriptionActivite: c.descriptionActivite || ''
                        }));
                    }
                },
                error: () => {
                    this.loading.set(false);
                }
            });
    }

    addPersonnecaution(): void {
        const telCtrl = this.personnecautionForm.get('telephone');
        const telValue = telCtrl?.value || '';
        // Le telephone est optionnel, mais s'il est saisi, il doit respecter le format guineen
        if (telValue && telValue !== '+224' && telCtrl?.invalid) {
            telCtrl?.markAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Telephone invalide',
                detail: 'Format attendu: +224 suivi de 9 chiffres (ex: +224621091895).'
            });
            return;
        }

        const personnecaution: Personnecaution = {
            nom: this.personnecautionForm.get('nom')?.value || '',
            prenom: this.personnecautionForm.get('prenom')?.value || '',
            telephone: this.personnecautionForm.get('telephone')?.value || '',
            activite: this.personnecautionForm.get('activite')?.value || '',
            age: this.personnecautionForm.get('age')?.value || undefined,
            profession: this.personnecautionForm.get('profession')?.value || '',
            adresseComplete: this.personnecautionForm.get('adresseComplete')?.value || '',
            descriptionActivite: this.personnecautionForm.get('descriptionActivite')?.value || ''
        };

        this.personnecautions.push(personnecaution);
        this.personnecautionForm.reset();

        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Personne caution ajoutée avec succès.'
        });
    }

    removePersonnecaution(index: number): void {
        this.personnecautions.splice(index, 1);
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: 'Personne caution supprimée.'
        });
    }

    savePersonnesCaution(): void {
        if (!this.demandeIndividuelId) return;

        this.saving.set(true);

        const request = {
            personnesCaution: this.personnecautions.map((pc) => ({
                nom: pc.nom || '',
                prenom: pc.prenom || '',
                telephone: pc.telephone || '',
                activite: pc.activite || '',
                age: pc.age || null,
                profession: pc.profession || '',
                adresseComplete: pc.adresseComplete || '',
                descriptionActivite: pc.descriptionActivite || ''
            }))
        };

        this.http
            .post<any>(`${this.apiUrl}/ecredit/bilan_finance/personnes-caution/${this.demandeIndividuelId}`, request)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.saving.set(false);
                    const saved = response?.data?.personnesCaution;
                    if (saved && Array.isArray(saved)) {
                        this.personnecautions = saved.map((c: any) => ({
                            personnecautionId: c.personnecautionId,
                            nom: c.nom || '',
                            prenom: c.prenom || '',
                            telephone: c.telephone || '',
                            activite: c.activite || '',
                            age: c.age || null,
                            profession: c.profession || '',
                            adresseComplete: c.adresseComplete || '',
                            descriptionActivite: c.descriptionActivite || ''
                        }));
                    }
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Succès',
                        detail: `${this.personnecautions.length} personne(s) caution enregistrée(s) avec succès.`
                    });
                },
                error: (error) => {
                    this.saving.set(false);
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Erreur lors de la sauvegarde des personnes caution.'
                    });
                }
            });
    }

    goBack(): void {
        this.router.navigate(['/dashboards/credit/individuel/attente/detail', this.demandeIndividuelId]);
    }
}
