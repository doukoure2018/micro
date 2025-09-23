import { IUser } from '@/interface/user';
import { UserService } from '@/service/user.service';
import { Component, DestroyRef, inject, Input, signal, OnInit, computed } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DividerModule } from 'primeng/divider';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddPersonnePhysiqueComponent } from '../add-personne-physique/add-personne-physique.component';
import { FicheSignaletique } from '@/interface/PersonnePhysique';

@Component({
    selector: 'app-agent-caisse',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ButtonModule, InputTextModule, CardModule, ToastModule, DialogModule, ProgressSpinnerModule, DividerModule, AddPersonnePhysiqueComponent],
    templateUrl: './agent-caisse.component.html',
    styleUrl: './agent-caisse.component.scss',
    providers: [MessageService]
})
export class AgentCaisseComponent implements OnInit {
    @Input() user?: IUser;

    state = signal<{
        user?: IUser;
        ficheSignaletique?: FicheSignaletique;
        loading: boolean;
        searching: boolean;
        message: string | undefined;
        error: string | any;
        showAddDialog: boolean;
    }>({
        loading: false,
        searching: false,
        message: undefined,
        error: undefined,
        showAddDialog: false
    });

    // Computed signals for template
    isLoading = computed(() => this.state().loading);
    isSearching = computed(() => this.state().searching);
    hasError = computed(() => !!this.state().error);
    ficheData = computed(() => this.state().ficheSignaletique);
    showDialog = computed(() => this.state().showAddDialog);

    searchForm: FormGroup;

    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);
    private messageService = inject(MessageService);
    private fb = inject(FormBuilder);

    constructor() {
        this.searchForm = this.fb.group({
            codCliente: ['', [Validators.required, Validators.pattern(/^\d{9,11}$/), Validators.minLength(9)]]
        });
    }

    ngOnInit(): void {
        this.loadUser();
    }

    loadUser(): void {
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService
            .getInstanceUser$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.state.update((s) => ({
                        ...s,
                        user: response.data.user,
                        loading: false
                    }));
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        error: error,
                        loading: false
                    }));
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Impossible de charger les informations utilisateur'
                    });
                }
            });
    }

    searchFicheSignaletique(): void {
        if (this.searchForm.invalid) {
            this.searchForm.markAllAsTouched();
            this.messageService.add({
                severity: 'warn',
                summary: 'Validation',
                detail: 'Le code client doit contenir entre 9 et 11 chiffres'
            });
            return;
        }

        const codCliente = this.searchForm.get('codCliente')?.value;
        this.state.update((s) => ({ ...s, searching: true, error: undefined }));

        this.userService
            .getFicheSignaletique$(codCliente)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    console.log('Full response received:', response);

                    // The actual fiche data is in response.data.data
                    if (response?.data?.data) {
                        const ficheData = response.data.data as FicheSignaletique;
                        console.log('Extracted fiche data:', ficheData);

                        this.state.update((s) => ({
                            ...s,
                            ficheSignaletique: ficheData,
                            searching: false
                        }));

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: 'Fiche signalétique récupérée avec succès'
                        });
                    }
                },
                error: (error) => {
                    this.state.update((s) => ({
                        ...s,
                        error: error,
                        searching: false,
                        ficheSignaletique: undefined
                    }));

                    let errorMessage = 'Erreur lors de la recherche';
                    if (error.status === 404) {
                        errorMessage = 'Client non trouvé';
                    } else if (error.status === 400) {
                        errorMessage = 'Code client invalide';
                    }

                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: errorMessage
                    });
                }
            });
    }

    openAddDialog(): void {
        this.state.update((s) => ({ ...s, showAddDialog: true }));
    }

    closeAddDialog(): void {
        this.state.update((s) => ({ ...s, showAddDialog: false }));
    }

    onPersonnePhysiqueAdded(result: any): void {
        this.closeAddDialog();
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: 'Personne physique ajoutée avec succès'
        });

        // Optionally search for the newly added person
        if (result?.codClientes) {
            this.searchForm.patchValue({ codCliente: result.codClientes });
            this.searchFicheSignaletique();
        }
    }

    clearSearch(): void {
        this.searchForm.reset();
        this.state.update((s) => ({
            ...s,
            ficheSignaletique: undefined,
            error: undefined
        }));
    }

    get codClienteControl() {
        return this.searchForm.get('codCliente');
    }
}
