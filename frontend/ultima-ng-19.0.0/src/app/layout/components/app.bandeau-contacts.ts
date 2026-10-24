import { ProfilContact } from '@/interface/profil-contact';
import { IResponse } from '@/interface/response';
import { UserService } from '@/service/user.service';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/**
 * Bandeau affiché tant que l'utilisateur n'a pas de contact utilisable : adresse en échec,
 * ou numéro absent (V172, lot 1 du chantier contacts vérifiés).
 *
 * Il ne bloque rien : un agent en tournée doit pouvoir travailler. Il reste simplement
 * là, à chaque page, jusqu'à la correction.
 */
@Component({
    selector: 'app-bandeau-contacts',
    standalone: true,
    imports: [CommonModule, RouterModule, ButtonModule],
    template: `
        <div *ngIf="profil() as p" class="bandeau-contacts">
            <i class="pi pi-exclamation-triangle"></i>
            <span class="texte">
                <ng-container *ngIf="p.emailEnEchec">Vos alertes ne vous parviennent pas : votre adresse e-mail est en échec.</ng-container>
                <ng-container *ngIf="!p.emailEnEchec && !p.telephone">Votre numéro de téléphone n'est pas enregistré : vous ne recevrez aucune alerte par SMS.</ng-container>
            </span>
            <a routerLink="/dashboards/mon-profil" class="lien">Corriger maintenant</a>
            <button type="button" class="fermer" (click)="masquer()" title="Masquer jusqu'à la prochaine connexion"><i class="pi pi-times"></i></button>
        </div>
    `,
    styles: [
        `
            .bandeau-contacts {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                flex-wrap: wrap;
                padding: 0.6rem 1rem;
                margin: 0 0 1rem 0;
                border-left: 3px solid #b3261e;
                background: #fbecea;
                color: #7a1f1f;
                font-size: 0.9rem;
                border-radius: 3px;
            }
            .bandeau-contacts .texte {
                flex: 1 1 260px;
            }
            .bandeau-contacts .lien {
                font-weight: 600;
                color: #b3261e;
                text-decoration: underline;
                cursor: pointer;
            }
            .bandeau-contacts .fermer {
                background: none;
                border: none;
                color: inherit;
                cursor: pointer;
                opacity: 0.7;
            }
        `
    ]
})
export class AppBandeauContacts implements OnInit {
    private userService = inject(UserService);
    private destroyRef = inject(DestroyRef);

    profil = signal<ProfilContact | null>(null);

    ngOnInit(): void {
        if (sessionStorage.getItem('bandeau-contacts-masque') === '1') {
            return;
        }
        this.userService
            .profilContacts$()
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe({
                next: (r: IResponse) => {
                    const profil = r.data?.profil as ProfilContact | undefined;
                    this.profil.set(profil?.acorriger ? profil : null);
                },
                // Silencieux : un bandeau n'a pas à faire échouer l'affichage de l'application.
                error: () => this.profil.set(null)
            });
    }

    /** Masqué jusqu'à la prochaine connexion seulement : le besoin, lui, reste. */
    masquer(): void {
        try {
            sessionStorage.setItem('bandeau-contacts-masque', '1');
        } catch {
            /* navigation privée : on masque quand même pour cette page */
        }
        this.profil.set(null);
    }
}
