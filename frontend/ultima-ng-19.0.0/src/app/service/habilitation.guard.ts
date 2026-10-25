import { HabilitationService } from '@/service/habilitation.service';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

/**
 * Barriere de route sur une rubrique d'habilitation (V178). A declarer ainsi :
 * {@code canActivate: [HabilitationGuard], data: { rubrique: 'CREDITS_NEGATIFS' }}.
 *
 * <p>Avant ce garde, quatre-vingt-cinq des quatre-vingt-dix routes du tableau de bord
 * n'avaient aucun controle : masquer l'entree du menu etait la seule protection, et taper
 * l'adresse suffisait a ouvrir l'ecran.</p>
 *
 * <p>Si le porte-cles ne peut pas etre lu, on laisse passer : le serveur verifie la meme
 * rubrique et refusera avec un message clair. Une panne de reseau ne doit pas enfermer un
 * agent hors des ecrans qui lui reviennent.</p>
 */
export const HabilitationGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const rubrique = route.data?.['rubrique'] as string | undefined;
    if (!rubrique) {
        return true;
    }
    const habilitations = inject(HabilitationService);
    const router = inject(Router);
    return habilitations.charger$().pipe(
        map((h) => (h.rubriques.includes(rubrique) ? true : router.createUrlTree(['/auth/access']))),
        catchError(() => of(true))
    );
};
