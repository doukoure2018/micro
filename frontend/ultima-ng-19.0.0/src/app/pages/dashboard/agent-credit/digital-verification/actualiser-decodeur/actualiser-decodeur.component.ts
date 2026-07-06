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

type ResultType = 'success' | 'cooldown' | 'inactive' | 'error';

interface ResultState {
    type: ResultType;
    message: string;
    decodeur?: string;
    suggestion?: string;
}

/**
 * Actualisation des chaînes d'un décodeur Canal+ (réactivation).
 * GRATUIT — pour les décodeurs dont l'abonnement est encore ACTIF mais dont les
 * chaînes ne s'affichent plus. Traitement temps réel côté Canal+ (30 à 90 s),
 * limité à 1 actualisation / 10 min / décodeur, SMS de confirmation au client.
 */
@Component({
    selector: 'app-actualiser-decodeur',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, ButtonModule, CardModule, MessageModule, ProgressSpinnerModule],
    templateUrl: './actualiser-decodeur.component.html',
    styleUrl: './actualiser-decodeur.component.scss'
})
export class ActualiserDecodeurComponent implements OnDestroy {
    private userService = inject(UserService);
    private fb = inject(FormBuilder);
    private destroyRef = inject(DestroyRef);

    processing = signal(false);
    result = signal<ResultState | null>(null);
    /** Secondes restantes avant la prochaine actualisation possible (réponse 429). */
    cooldownRemaining = signal<number>(0);
    private cooldownTimer: ReturnType<typeof setInterval> | null = null;

    form: FormGroup = this.fb.group({
        numAbonne: ['', [Validators.required, Validators.pattern(/^[\d\s]{14,20}$/)]],
        phoneNumber: ['', [Validators.required, Validators.pattern(/^(\+?224|00224)?[\d\s]{9,14}$/)]]
    });

    submit(): void {
        if (this.form.invalid || this.processing()) {
            this.form.markAllAsTouched();
            return;
        }
        this.stopCooldown();
        this.result.set(null);
        this.processing.set(true);

        const numAbonne = (this.form.value.numAbonne || '').replace(/\s/g, '');
        const phoneNumber = (this.form.value.phoneNumber || '').replace(/\s/g, '');

        this.userService
            .actualiserDecodeur$(numAbonne, phoneNumber)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (response) => {
                    // 200 (déjà en cours) et 201 (déclenchée) = succès (cf. doc §4.6)
                    this.processing.set(false);
                    this.result.set({
                        type: 'success',
                        message: response?.message || 'Actualisation des chaînes déclenchée avec succès',
                        decodeur: response?.data?.decodeur || numAbonne
                    });
                    this.form.reset();
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

    ngOnDestroy(): void {
        this.stopCooldown();
    }
}
