import { CommonModule } from '@angular/common';
import { Component, OnInit, signal, inject, computed, effect } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { RippleModule } from 'primeng/ripple';
import { ConfirmationService, MessageService } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';

import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SkeletonModule } from 'primeng/skeleton';
import { UserService } from '@/service/user.service';
import { finalize } from 'rxjs';
import { TextareaModule } from 'primeng/textarea';
import { StockResponseDto } from '@/interface/StockResponseDto';
import { CategorieStockDto } from '@/interface/CategorieStockDto';
import { CreateStockDto } from '@/interface/CreateStockDto';

interface CategoryField {
    name: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'textarea';
    required: boolean;
    options?: any[];
}

@Component({
    selector: 'app-stock-cmd',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
        RippleModule,
        MessageModule,
        TableModule,
        IconFieldModule,
        InputIconModule,
        TagModule,
        CardModule,
        InputTextModule,
        TextareaModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        DialogModule,
        ToastModule,
        ConfirmDialogModule,
        DividerModule,
        ProgressSpinnerModule,
        SkeletonModule
    ],
    templateUrl: './stock-cmd.component.html',
    styleUrl: './stock-cmd.component.scss',
    providers: [MessageService, ConfirmationService]
})
export class StockCmdComponent implements OnInit {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private messageService = inject(MessageService);
    private confirmationService = inject(ConfirmationService);

    // Signals pour l'état
    state = signal<{
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

    // Données
    stocks = signal<StockResponseDto[]>([]);
    listCategorieStock = signal<CategorieStockDto[]>([]);
    delegations = signal<any[]>([]);
    agences = signal<any[]>([]);
    pointsVente = signal<any[]>([]);
    currentUser = signal<any>(null);

    // Champs dynamiques basés sur la catégorie
    dynamicFields = signal<CategoryField[]>([]);

    // Dialog
    displayDialog = signal(false);
    selectedStock = signal<StockResponseDto | null>(null);

    // Pagination
    currentPage = signal(0);
    pageSize = signal(10);
    totalRecords = signal(0);

    // Recherche
    searchValue = signal('');

    // Formulaire
    stockForm!: FormGroup;
    dynamicForm!: FormGroup;

    // Computed values
    filteredStocks = computed(() => {
        const search = this.searchValue().toLowerCase();
        const allStocks = this.stocks();

        if (!search) return allStocks;

        return allStocks.filter(
            (stock) => stock.numeroCommande?.toLowerCase().includes(search) || stock.service?.toLowerCase().includes(search) || stock.detailBonCommande?.toLowerCase().includes(search) || stock.categorieLibele?.toLowerCase().includes(search)
        );
    });

    ngOnInit(): void {
        this.initializeForm();
        this.loadInitialData();
        this.getCurrentUser();
    }

    // Ajoutez cette propriété
    services = [
        { label: 'Direction Exploitation', value: 'DE' },
        { label: 'Direction Inspection', value: 'DI' },
        { label: "Direction du Système d'Information et de Gestion", value: 'DSIG' },
        { label: 'Direction des Ressources Humaines', value: 'DRH' },
        { label: 'Direction Commerciale', value: 'DC' }
    ];

    initializeForm(): void {
        this.stockForm = this.fb.group({
            service: ['', [Validators.required]],
            detailBonCommande: [''],
            delegationId: [null],
            agenceId: [{ value: null, disabled: true }],
            pointventeId: [{ value: null, disabled: true }],
            categorieId: [null, Validators.required],
            observations: ['']
        });

        // Dynamic form pour les champs additionnels
        this.dynamicForm = this.fb.group({});

        // Listeners pour les cascades de sélection
        this.stockForm.get('delegationId')?.valueChanges.subscribe((delegationId) => {
            if (delegationId) {
                this.loadAgences(delegationId);
                this.stockForm.get('agenceId')?.enable();
                this.stockForm.get('agenceId')?.reset();
                this.stockForm.get('pointventeId')?.reset();
                this.stockForm.get('pointventeId')?.disable();
            }
        });

        this.stockForm.get('agenceId')?.valueChanges.subscribe((agenceId) => {
            if (agenceId) {
                this.loadPointsVente(agenceId);
                this.stockForm.get('pointventeId')?.enable();
                this.stockForm.get('pointventeId')?.reset();
            }
        });
    }

    // Méthode utilitaire pour extraire l'ID utilisateur
    private getUserId(user: any): number | string | null {
        if (!user) return null;

        // Essayer différentes propriétés possibles pour l'ID
        const possibleIds = [user.user_id, user.userId, user.id, user.userUuid, user.uuid, user.USER_ID, user.ID];

        // Retourner le premier ID valide trouvé
        for (const id of possibleIds) {
            if (id !== undefined && id !== null && id !== '') {
                return id;
            }
        }

        console.error("Aucun ID trouvé dans l'objet utilisateur:", user);
        return null;
    }

    getCurrentUser(): void {
        // Utiliser getInstanceUser$ pour récupérer l'utilisateur actuel
        this.userService.getInstanceUser$().subscribe({
            next: (response) => {
                console.log('User response:', response);
                if (response.data.user) {
                    this.currentUser.set(response.data.user);
                    console.log('Current user set:', this.currentUser());
                    // Ne charger les stocks qu'après avoir défini l'utilisateur
                    this.loadUserStocks();
                }
            },
            error: (error) => {
                console.error('Erreur lors de la récupération du profil:', error);
                this.showError('Impossible de récupérer les informations utilisateur');
            }
        });
    }

    loadInitialData(): void {
        this.state.update((s) => ({ ...s, loading: true }));

        // Charger les catégories
        this.userService.getCategoriesStock$().subscribe({
            next: (response) => {
                console.log('Categories response:', response);

                // Essayer différentes propriétés possibles
                const categories = response.data.listCategorieStock || response.data;

                if (categories && Array.isArray(categories)) {
                    this.listCategorieStock.set(categories);
                    console.log('Categories loaded:', this.listCategorieStock());
                } else if (categories && !Array.isArray(categories)) {
                    // Si ce n'est pas un tableau, peut-être que c'est un objet avec les catégories dedans
                    console.log('Categories structure:', categories);
                    this.showError('Format de catégories non reconnu');
                } else {
                    console.warn('Aucune catégorie trouvée dans la réponse');
                    this.listCategorieStock.set([]);
                }
            },
            error: (error) => {
                console.error('Erreur catégories:', error);
                this.showError('Erreur lors du chargement des catégories');
                this.listCategorieStock.set([]);
            }
        });

        // Charger les délégations
        this.userService.getAllDelegation$().subscribe({
            next: (response) => {
                console.log('Delegations response:', response);

                // Essayer différentes propriétés possibles
                const delegations = response.data.delegations || response.data;

                if (delegations && Array.isArray(delegations)) {
                    this.delegations.set(delegations);
                    console.log('Delegations loaded:', this.delegations());
                } else {
                    console.warn('Aucune délégation trouvée dans la réponse');
                    this.delegations.set([]);
                }
            },
            error: (error) => {
                console.error('Erreur délégations:', error);
                this.showError('Erreur lors du chargement des délégations');
                this.delegations.set([]);
            },
            complete: () => {
                this.state.update((s) => ({ ...s, loading: false }));
            }
        });
    }

    loadAgences(delegationId: number): void {
        this.userService.getAllAgenceByDelegationId$(delegationId).subscribe({
            next: (response) => {
                // Le format peut varier selon votre backend
                if (response?.data?.agences) {
                    this.agences.set(response.data.agences);
                    console.log(`✅ ${response.data.agences.length} agences loaded for delegation ${delegationId}`);
                } else {
                    console.warn('Aucune agence trouvée');
                    this.agences.set([]);
                }
            },
            error: (error) => {
                this.showError('Erreur lors du chargement des agences');
                this.agences.set([]);
            }
        });
    }

    loadPointsVente(agenceId: number): void {
        this.userService.getAllPointventesByAgenceId$(agenceId).subscribe({
            next: (response) => {
                // Le format peut varier selon votre backend
                if (response?.data?.pointVentes) {
                    this.pointsVente.set(response.data.pointVentes);
                    console.log(`✅ ${response.data.pointVentes.length} points de vente loaded for agence ${agenceId}`);
                } else {
                    console.warn('Aucun point de vente trouvé');
                    this.pointsVente.set([]);
                }
            },
            error: (error) => {
                this.showError('Erreur lors du chargement des points de vente');
                this.pointsVente.set([]);
            }
        });
    }

    loadUserStocks(): void {
        const user = this.currentUser();
        console.log('Loading stocks for user:', user);

        if (!user) {
            console.warn('Aucun utilisateur trouvé, impossible de charger les stocks');
            return;
        }

        const userId = this.getUserId(user);

        if (!userId) {
            this.showError("Impossible de récupérer l'ID utilisateur");
            return;
        }

        console.log('Using userId:', userId);
        this.state.update((s) => ({ ...s, loading: true }));

        this.userService.getStockByUser$(Number(userId)).subscribe({
            next: (response) => {
                console.log('Stocks response:', response);
                if (response.data.stocks) {
                    this.stocks.set(response.data.stocks);
                    this.totalRecords.set(response.data.stocks.length);
                    this.showInfo(`${response.data.stocks.length} bon(s) de commande chargé(s)`);
                } else {
                    this.stocks.set([]);
                    this.totalRecords.set(0);
                }
            },
            error: (error) => {
                console.error('Erreur lors du chargement des stocks:', error);
                this.showError('Erreur lors du chargement des stocks');
                this.stocks.set([]);
                this.totalRecords.set(0);
            },
            complete: () => {
                this.state.update((s) => ({ ...s, loading: false }));
            }
        });
    }

    onSubmit(): void {
        if (this.stockForm.invalid) {
            this.markFormGroupTouched(this.stockForm);
            this.showError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (this.dynamicForm.invalid) {
            this.markFormGroupTouched(this.dynamicForm);
            this.showError('Veuillez remplir tous les champs dynamiques obligatoires');
            return;
        }

        const user = this.currentUser();
        if (!user) {
            this.showError('Utilisateur non connecté');
            return;
        }

        const userId = this.getUserId(user);

        if (!userId) {
            this.showError("Impossible de récupérer l'ID utilisateur");
            return;
        }

        this.state.update((s) => ({ ...s, submitting: true }));

        const formValue = this.stockForm.value;
        const dynamicValues = this.dynamicForm.value;

        // Combiner les détails standards et dynamiques
        const detailsComplets = {
            detailStandard: formValue.detailBonCommande,
            ...dynamicValues
        };

        const stockDto: CreateStockDto = {
            idUser: Number(userId),
            service: formValue.service,
            detailBonCommande: JSON.stringify(detailsComplets),
            delegationId: formValue.delegationId,
            agenceId: formValue.agenceId,
            pointventeId: formValue.pointventeId,
            categorieId: formValue.categorieId,
            observations: formValue.observations
        };

        console.log('Submitting stock DTO:', stockDto);

        this.userService
            .createStock$(stockDto)
            .pipe(finalize(() => this.state.update((s) => ({ ...s, submitting: false }))))
            .subscribe({
                next: (response) => {
                    console.log('Create stock response:', response);
                    if (response.data.stock) {
                        // Ajouter le nouveau stock à la liste
                        this.stocks.update((stocks) => [response.data.stock!, ...stocks]);
                        this.totalRecords.update((total) => total + 1);

                        // Réinitialiser le formulaire
                        this.resetForm();

                        this.showSuccess('Bon de commande créé avec succès');
                    }
                },
                error: (error) => {
                    console.error('Erreur création stock:', error);
                    this.showError(error || 'Erreur lors de la création du bon de commande');
                }
            });
    }

    resetForm(): void {
        this.stockForm.reset();
        this.dynamicForm.reset();
        this.dynamicFields.set([]);
        this.stockForm.get('agenceId')?.disable();
        this.stockForm.get('pointventeId')?.disable();
    }

    viewStock(stock: StockResponseDto): void {
        this.selectedStock.set(stock);
        this.displayDialog.set(true);
    }

    editStock(stock: StockResponseDto): void {
        // Implémenter la logique d'édition si nécessaire
        console.log('Éditer le stock:', stock);
    }

    deleteStock(stock: StockResponseDto): void {
        this.confirmationService.confirm({
            message: `Êtes-vous sûr de vouloir supprimer le bon de commande ${stock.numeroCommande}?`,
            header: 'Confirmation de suppression',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Oui',
            rejectLabel: 'Non',
            accept: () => {
                // Implémenter la logique de suppression
                this.showSuccess('Bon de commande supprimé avec succès');
            }
        });
    }

    approveStock(stock: StockResponseDto): void {
        const user = this.currentUser();

        if (!user) {
            this.showError('Utilisateur non connecté');
            return;
        }

        const userId = this.getUserId(user);

        if (!userId) {
            this.showError("Impossible de récupérer l'ID utilisateur");
            return;
        }

        this.confirmationService.confirm({
            message: `Approuver le bon de commande ${stock.numeroCommande}?`,
            header: "Confirmation d'approbation",
            icon: 'pi pi-check',
            acceptLabel: 'Approuver',
            rejectLabel: 'Annuler',
            accept: () => {
                this.userService.approveStock$(stock.idCmd, Number(userId), 'Approuvé').subscribe({
                    next: (response) => {
                        this.showSuccess('Bon de commande approuvé');
                        this.loadUserStocks();
                    },
                    error: (error) => {
                        this.showError("Erreur lors de l'approbation");
                    }
                });
            }
        });
    }

    rejectStock(stock: StockResponseDto): void {
        const user = this.currentUser();

        if (!user) {
            this.showError('Utilisateur non connecté');
            return;
        }

        const userId = this.getUserId(user);

        if (!userId) {
            this.showError("Impossible de récupérer l'ID utilisateur");
            return;
        }

        const motif = prompt('Motif du rejet:');

        if (motif) {
            this.userService.rejectStock$(stock.idCmd, Number(userId), motif).subscribe({
                next: (response) => {
                    this.showSuccess('Bon de commande rejeté');
                    this.loadUserStocks();
                },
                error: (error) => {
                    this.showError('Erreur lors du rejet');
                }
            });
        }
    }

    getStatusSeverity(status: string): 'success' | 'warn' | 'danger' | 'info' {
        switch (status) {
            case 'ACCEPT':
                return 'success';
            case 'REJET':
                return 'danger';
            case 'ENCOURS':
                return 'warn';
            default:
                return 'info';
        }
    }

    getStatusLabel(status: string): string {
        switch (status) {
            case 'ACCEPT':
                return 'Accepté';
            case 'REJET':
                return 'Rejeté';
            case 'ENCOURS':
                return 'En cours';
            default:
                return status;
        }
    }

    onPageChange(event: any): void {
        this.currentPage.set(event.page);
        this.pageSize.set(event.rows);
        this.loadUserStocks();
    }

    onSearch(event: any): void {
        this.searchValue.set(event.target.value);
    }

    exportToExcel(): void {
        // Implémenter l'export Excel
        console.log('Export Excel');
    }

    private markFormGroupTouched(formGroup: FormGroup): void {
        Object.keys(formGroup.controls).forEach((key) => {
            const control = formGroup.get(key);
            control?.markAsTouched();

            if (control instanceof FormGroup) {
                this.markFormGroupTouched(control);
            }
        });
    }

    private showSuccess(message: string): void {
        this.messageService.add({
            severity: 'success',
            summary: 'Succès',
            detail: message,
            life: 3000
        });
    }

    private showError(message: string): void {
        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message,
            life: 5000
        });
    }

    private showInfo(message: string): void {
        this.messageService.add({
            severity: 'info',
            summary: 'Information',
            detail: message,
            life: 3000
        });
    }
}
