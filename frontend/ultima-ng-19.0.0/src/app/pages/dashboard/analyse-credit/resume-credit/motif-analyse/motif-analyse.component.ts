import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, Input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { TagModule } from 'primeng/tag';
import { TableModule } from 'primeng/table';
import { MotifAnalyse } from '@/interface/motif.analyse';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { TextareaModule } from 'primeng/textarea';
import { IUser } from '@/interface/user';

interface MotifAnalyseDisplay {
    motifAnalyseId: number;
    motif: string;
    motifDate: string;
    userName?: string;
}

@Component({
    selector: 'app-motif-analyse',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, CardModule, ButtonModule, TextareaModule, ProgressSpinnerModule, ToastModule, DividerModule, TagModule, TableModule],
    templateUrl: './motif-analyse.component.html',
    styleUrl: './motif-analyse.component.scss',
    providers: [MessageService]
})
export class MotifAnalyseComponent {
    // Injections
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private messageService = inject(MessageService);
    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);

    // Inputs (peuvent être passés par le parent ou récupérés depuis l'URL)
    @Input() demandeCreditId: number | null = null;
    @Input() user: IUser | null = null;
    @Input() motifs_analyses: any[] = [];

    // État du composant
    state = signal<{
        loading: boolean;
        loadingSubmit: boolean;
        loadingMotifs: boolean;
        message: string | undefined;
        error: string | any;
        motifs: MotifAnalyseDisplay[];
        showForm: boolean;
        canAddMotif: boolean;
    }>({
        loading: false,
        loadingSubmit: false,
        loadingMotifs: false,
        message: undefined,
        error: undefined,
        motifs: [],
        showForm: false,
        canAddMotif: false
    });

    // Formulaire
    motifForm: FormGroup;

    constructor() {
        this.motifForm = this.fb.group({
            motif: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
        });
    }

    ngOnInit(): void {
        // Récupérer les paramètres depuis l'URL si pas fournis en Input
        this.route.params.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
            if (!this.demandeCreditId && params['demandeId']) {
                this.demandeCreditId = +params['demandeId'];
            }
            if (!this.user?.userId && params['userId']) {
                if (!this.user) {
                    this.user = {} as IUser;
                }
                this.user.userId = +params['userId'];
            }

            console.log('📋 Motif Analyse - Paramètres:', {
                demandeCreditId: this.demandeCreditId,
                userId: this.user?.userId,
                userRole: this.user?.role,
                motifsReçus: this.motifs_analyses
            });

            // Vérifier si l'utilisateur peut ajouter des motifs
            this.checkUserPermissions();

            // Charger les motifs existants depuis l'Input
            this.loadMotifsFromInput();
        });
    }

    ngOnChanges(): void {
        // Re-vérifier les permissions si l'utilisateur change
        if (this.user) {
            this.checkUserPermissions();
        }

        // Recharger les motifs si l'Input change
        if (this.motifs_analyses) {
            this.loadMotifsFromInput();
        }
    }

    // ========================================
    // MÉTHODES DE CHARGEMENT DES DONNÉES
    // ========================================

    /**
     * Vérifie si l'utilisateur peut ajouter des motifs
     */
    private checkUserPermissions(): void {
        const canAdd = this.user?.role === 'MANAGER';
        this.state.update((current) => ({
            ...current,
            canAddMotif: canAdd
        }));

        console.log('🔐 Permissions utilisateur:', {
            role: this.user?.role,
            canAddMotif: canAdd
        });
    }

    /**
     * Charge les motifs depuis l'Input
     */
    private loadMotifsFromInput(): void {
        if (!this.motifs_analyses || this.motifs_analyses.length === 0) {
            this.state.update((current) => ({
                ...current,
                motifs: []
            }));
            return;
        }

        console.log('📥 Chargement des motifs depuis Input:', this.motifs_analyses);

        const motifsFormatted = this.motifs_analyses.map((motif) => ({
            motifAnalyseId: motif.motif_analyse_id || motif.motifAnalyseId,
            motif: motif.motif || '',
            motifDate: this.formatDateForDisplay(motif.motif_date || motif.motifDate),
            userId: motif.user_id || motif.userId,
            userName: this.getUserNameForMotif(motif.user_id || motif.userId)
        }));

        this.state.update((current) => ({
            ...current,
            motifs: motifsFormatted
        }));
    }

    /**
     * Détermine le nom d'utilisateur pour un motif
     */
    private getUserNameForMotif(userId?: number): string {
        // Si c'est l'utilisateur actuel
        if (userId && this.user?.userId === userId) {
            return 'Vous';
        }

        // Sinon, on pourrait chercher dans une liste d'utilisateurs ou retourner un placeholder
        return `Utilisateur ${userId || '?'}`;
    }

    /**
     * Charge les motifs existants pour cette demande
     * Note: Cette méthode nécessiterait un endpoint dédié côté backend
     */
    chargerMotifsExistants(): void {
        if (!this.demandeCreditId) return;

        this.state.update((current) => ({
            ...current,
            loadingMotifs: true
        }));

        // Cette méthode n'est plus nécessaire car les motifs sont passés via Input
        // Mais on la garde au cas où on voudrait implémenter un rechargement
        setTimeout(() => {
            this.state.update((current) => ({
                ...current,
                loadingMotifs: false
            }));
        }, 100);
    }

    // ========================================
    // MÉTHODES DE GESTION DU FORMULAIRE
    // ========================================

    /**
     * Affiche/masque le formulaire d'ajout
     */
    toggleForm(): void {
        // Vérifier les permissions avant d'afficher le formulaire
        if (!this.state().canAddMotif) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Accès refusé',
                detail: "Seuls les managers peuvent ajouter des motifs d'analyse"
            });
            return;
        }

        this.state.update((current) => ({
            ...current,
            showForm: !current.showForm
        }));

        if (this.state().showForm) {
            this.motifForm.reset();
        }
    }

    /**
     * Soumet le formulaire d'ajout de motif
     */
    onSubmit(): void {
        // Double vérification des permissions
        if (!this.state().canAddMotif) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erreur',
                detail: "Vous n'avez pas les permissions pour ajouter un motif"
            });
            return;
        }

        if (this.motifForm.invalid || !this.demandeCreditId) {
            this.markFormGroupTouched();
            return;
        }

        const motifValue = this.motifForm.get('motif')?.value?.trim();
        if (!motifValue) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Attention',
                detail: 'Veuillez saisir un motif'
            });
            return;
        }

        this.state.update((current) => ({
            ...current,
            loadingSubmit: true,
            error: undefined
        }));

        const newMotif: MotifAnalyse = {
            motif: motifValue,
            motifDate: new Date()
            // userId et demandeCreditId seront définis côté backend
        };

        console.log('📤 Envoi du motif:', newMotif);
        console.log('🎯 Pour la demande:', this.demandeCreditId);

        this.userService
            .addMotifAnalyse$(newMotif, this.demandeCreditId)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response: IResponse) => {
                    console.log('✅ Réponse reçue:', response);

                    if (response.data?.motifAnalyse) {
                        // Ajouter le nouveau motif à la liste
                        const nouveauMotif: MotifAnalyseDisplay = {
                            motifAnalyseId: response.data.motifAnalyse.motifAnalyseId!,
                            motif: response.data.motifAnalyse.motif || '',
                            motifDate: this.formatDateForDisplay(response.data.motifAnalyse.motifDate!),
                            // userId: this.user?.userId,
                            userName: 'Vous'
                        };

                        this.state.update((current) => ({
                            ...current,
                            motifs: [nouveauMotif, ...current.motifs],
                            loadingSubmit: false,
                            showForm: false
                        }));

                        this.motifForm.reset();

                        this.messageService.add({
                            severity: 'success',
                            summary: 'Succès',
                            detail: "Motif d'analyse ajouté avec succès"
                        });
                    } else {
                        this.gererErreur('Réponse invalide du serveur');
                    }
                },
                error: (error) => {
                    this.gererErreur("Erreur lors de l'ajout du motif", error);
                }
            });
    }

    /**
     * Marque tous les champs du formulaire comme touchés
     */
    private markFormGroupTouched(): void {
        Object.keys(this.motifForm.controls).forEach((key) => {
            const control = this.motifForm.get(key);
            control?.markAsTouched();
        });
    }

    /**
     * Gère les erreurs
     */
    private gererErreur(message: string, error?: any): void {
        this.state.update((current) => ({
            ...current,
            loadingSubmit: false,
            error: error
        }));

        this.messageService.add({
            severity: 'error',
            summary: 'Erreur',
            detail: message
        });

        console.error('❌ Erreur:', error);
    }

    // ========================================
    // MÉTHODES UTILITAIRES
    // ========================================

    /**
     * Formate une date pour l'affichage
     */
    formatDateForDisplay(date: Date | string | null): string {
        if (!date) return '';

        let dateObj: Date;

        if (typeof date === 'string') {
            dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return date;
            }
        } else if (date instanceof Date) {
            dateObj = date;
        } else {
            return '';
        }

        return dateObj.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * Vérifie si un champ a une erreur et a été touché
     */
    hasFieldError(fieldName: string): boolean {
        const field = this.motifForm.get(fieldName);
        return !!(field && field.invalid && field.touched);
    }

    /**
     * Récupère le message d'erreur pour un champ
     */
    getFieldError(fieldName: string): string {
        const field = this.motifForm.get(fieldName);
        if (field && field.errors && field.touched) {
            if (field.errors['required']) {
                return 'Ce champ est obligatoire';
            }
            if (field.errors['minlength']) {
                return `Minimum ${field.errors['minlength'].requiredLength} caractères`;
            }
            if (field.errors['maxlength']) {
                return `Maximum ${field.errors['maxlength'].requiredLength} caractères`;
            }
        }
        return '';
    }

    /**
     * Compte le nombre de caractères restants
     */
    getCharacterCount(): string {
        const motifValue = this.motifForm.get('motif')?.value || '';
        const remaining = 500 - motifValue.length;
        return `${motifValue.length}/500 caractères`;
    }

    /**
     * Détermine la couleur du compteur de caractères
     */
    getCharacterCountClass(): string {
        const motifValue = this.motifForm.get('motif')?.value || '';
        const length = motifValue.length;

        if (length > 450) return 'text-red-600';
        if (length > 400) return 'text-orange-600';
        if (length > 300) return 'text-yellow-600';
        return 'text-gray-600';
    }

    /**
     * Vérifie si des motifs existent
     */
    hasMotifs(): boolean {
        return this.state().motifs.length > 0;
    }

    /**
     * Vérifie si l'utilisateur est un manager
     */
    isManager(): boolean {
        return this.state().canAddMotif;
    }

    /**
     * Annule l'ajout et ferme le formulaire
     */
    annuler(): void {
        this.motifForm.reset();
        this.state.update((current) => ({
            ...current,
            showForm: false
        }));
    }
}
