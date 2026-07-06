import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnDestroy, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TagModule } from 'primeng/tag';

type ResultType = 'success' | 'cooldown' | 'inactive' | 'error';

interface ResultState {
    type: ResultType;
    message: string;
    decodeur?: string;
    suggestion?: string;
}

/** Infos abonné renvoyées par le check-decoder (parsées défensivement : la casse des
 *  champs varie entre le doc et l'API réelle — type_recherche vs typeRecherche...). */
interface DecoderInfo {
    existe: boolean;
    statut?: string;
    nom?: string;
    offre?: string;
    dateFin?: string;
    ville?: string;
    message?: string;
    conseil?: string;
}

/**
 * Actualisation des chaînes d'un décodeur Canal+ — parcours en 2 étapes OBLIGATOIRES :
 *  1. Vérification du statut de l'abonnement (check-decoder, ~60 s) : l'abonné doit
 *     exister et son contrat être « Active » ; sinon ARRÊT (réabonnement à proposer).
 *  2. Actualisation (réactivation, 30-90 s) — gratuite, SMS de confirmation au client,
 *     1 actualisation / 10 min / décodeur.
 */
@Component({
    selector: 'app-actualiser-decodeur',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, MessageModule, ProgressSpinnerModule, TagModule],
    templateUrl: './actualiser-decodeur.component.html',
    styleUrl: './actualiser-decodeur.component.scss'
})
export class ActualiserDecodeurComponent implements OnDestroy {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);

    // Étape 1 : vérification
    checking = signal(false);
    decoderInfo = signal<DecoderInfo | null>(null);
    checkedNumAbonne = signal<string>('');

    // Étape 2 : actualisation
    processing = signal(false);
    result = signal<ResultState | null>(null);
    cooldownRemaining = signal<number>(0);
    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    form: FormGroup = this.fb.group({
        numAbonne: ['', [Validators.required, Validators.pattern(/^[\d\s]{14,20}$/)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+?224|00224)?[\d\s]{9,14}$/)]]
    });

    constructor() {
        // Tout changement du numéro de décodeur invalide la vérification précédente
        this.form
            .get('numAbonne')!
            .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((value) => {
                const normalized = (value || '').replace(/\s/g, '');
                if (this.decoderInfo() && normalized !== this.checkedNumAbonne()) {
                    this.decoderInfo.set(null);
                    this.result.set(null);
                    this.stopCooldown();
                }
            });
    }

    /** Le contrat est actif : l'étape 2 (actualisation) est autorisée. */
    canReactivate(): boolean {
        const info = this.decoderInfo();
        return !!info && info.existe && (info.statut || '').toLowerCase() === 'active';
    }

    // ==================== ÉTAPE 1 : VÉRIFICATION ====================

    verifier(): void {
        if (this.form.get('numAbonne')?.invalid || this.checking() || this.processing()) {
            this.form.get('numAbonne')?.markAsTouched();
            return;
        }
        const numAbonne = (this.form.value.numAbonne || '').replace(/\s/g, '');
        this.checking.set(true);
        this.decoderInfo.set(null);
        this.result.set(null);
        this.stopCooldown();

        this.userService
            .checkDecodeur$(numAbonne)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    this.checking.set(false);
                    this.checkedNumAbonne.set(numAbonne);
                    this.decoderInfo.set(this.parseDecoderInfo(response));
                },
                error: (err: HttpErrorResponse) => {
                    this.checking.set(false);
                    this.result.set({
                        type: 'error',
                        message: err.error?.message || 'Impossible de vérifier le décodeur. Réessayez plus tard.',
                        decodeur: numAbonne
                    });
                }
            });
    }

    /** Parsing défensif : champs à la racine ou sous data, casse variable. */
    private parseDecoderInfo(response: any): DecoderInfo {
        const src = response?.data && typeof response.data === 'object' && 'existe' in response.data ? response.data : response || {};
        return {
            existe: src.existe === true,
            statut: src.statut ?? src.status,
            nom: src.nom ?? src.name,
            offre: src.offre,
            dateFin: src.date_fin ?? src.dateFin,
            ville: src.ville,
            message: src.message,
            conseil: src.conseil
        };
    }

    statutSeverity(): 'success' | 'danger' {
        return this.canReactivate() ? 'success' : 'danger';
    }

    // ==================== ÉTAPE 2 : ACTUALISATION ====================

    submit(): void {
        // Garde-fou : jamais d'actualisation sans vérification préalable réussie (règle API)
        if (!this.canReactivate() || this.form.invalid || this.processing()) {
            this.form.markAllAsTouched();
            return;
        }
        this.stopCooldown();
        this.result.set(null);
        this.processing.set(true);

        const numAbonne = this.checkedNumAbonne();
        const phoneNumber = (this.form.value.phoneNumber || '').replace(/\s/g, '');

        this.userService
            .actualiserDecodeur$(numAbonne, phoneNumber)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    // 200 (déjà en cours) et 201 (déclenchée) = succès (cf. doc §5.6)
                    this.processing.set(false);
                    this.result.set({
                        type: 'success',
                        message: response?.message || 'Actualisation des chaînes déclenchée avec succès',
                        decodeur: response?.data?.decodeur || numAbonne
                    });
                },
                error: (err: HttpErrorResponse) => {
                    this.processing.set(false);
                    this.handleError(err, numAbonne);
                }
            });
    }

    private handleError(err: HttpErrorResponse, numAbonne: string): void {
        const body = err.error || {};
        switch (err.status) {
            case 429: {
                // Cooldown 10 min : afficher le temps restant, PAS de retry automatique
                const seconds = Number(body?.data?.cooldownSecondsRemaining) || 600;
                this.startCooldown(seconds);
                this.result.set({
                    type: 'cooldown',
                    message: body?.message || 'Une actualisation a déjà eu lieu récemment pour ce décodeur.',
                    decodeur: body?.data?.decodeur || numAbonne
                });
                break;
            }
            case 422:
                // Contrat expiré/résilié -> parcours réabonnement
                this.result.set({
                    type: 'inactive',
                    message: body?.message || "Le contrat de ce décodeur n'est pas actif.",
                    decodeur: body?.data?.decodeur || numAbonne,
                    suggestion: body?.data?.suggestion || 'Utilisez la fonction Réabonnement pour ce décodeur.'
                });
                break;
            default:
                this.result.set({
                    type: 'error',
                    message: body?.message || "Une erreur est survenue lors de l'actualisation. Réessayez plus tard.",
                    decodeur: numAbonne
                });
        }
    }

    // ==================== Cooldown / utilitaires ====================

    private startCooldown(seconds: number): void {
        this.cooldownRemaining.set(seconds);
        this.cooldownTimer = setInterval(() => {
            const left = this.cooldownRemaining() - 1;
            this.cooldownRemaining.set(Math.max(0, left));
            if (left <= 0) {
                this.stopCooldown();
            }
        }, 1000);
    }

    private stopCooldown(): void {
        if (this.cooldownTimer) {
            clearInterval(this.cooldownTimer);
            this.cooldownTimer = null;
        }
        this.cooldownRemaining.set(0);
    }

    formatCooldown(): string {
        const total = this.cooldownRemaining();
        const min = Math.floor(total / 60);
        const sec = total % 60;
        return min > 0 ? `${min}min ${sec.toString().padStart(2, '0')}s` : `${sec}s`;
    }

    reset(): void {
        this.result.set(null);
        this.stopCooldown();
    }

    nouvelleVerification(): void {
        this.form.reset();
        this.decoderInfo.set(null);
        this.checkedNumAbonne.set('');
        this.result.set(null);
        this.stopCooldown();
    }

    ngOnDestroy(): void {
        this.stopCooldown();
    }
}
