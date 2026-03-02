import { Personnecaution } from '@/interface/personnecaution';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        InputNumberModule,
        CardModule,
        ToastModule,
        TextareaModule,
        TooltipModule,
        ProgressSpinnerModule
    ],
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

    private initForm(): void {
        this.personnecautionForm = this.fb.group({
            nom: [''],
            prenom: [''],
            telephone: [''],
            activite: [''],
            age: [null],
            profession: [''],
            adresseComplete: [''],
            descriptionActivite: ['']
        });
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
