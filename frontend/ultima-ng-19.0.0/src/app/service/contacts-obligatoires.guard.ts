import { ProfilContact } from '@/interface/profil-contact';
import { IResponse } from '@/interface/response';
import { Injectable, inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable, catchError, map, of, shareReplay, tap } from 'rxjs';
import { UserService } from './user.service';

/**
 * Correction obligatoire des contacts (V174, décision DSIG du 24/10/2026).
 *
 * Les comptes dont l'adresse a été constatée en échec sont conduits à la page « Mon profil »
 * dès leur connexion, et n'en sortent qu'une fois leur adresse et leur numéro prouvés par un
 * code. Ils se connectent tous les jours, mais aucune alerte ne leur parvient : la correction
 * ne peut plus attendre.
 *
 * Les autres comptes ne sont pas concernés. Bloquer tout le monde arrêterait le travail du
 * réseau, puisque la plupart des comptes n'ont pas encore de numéro.
 */
@Injectable({ providedIn: 'root' })
export class ContactsObligationService {
    private userService = inject(UserService);
    private cache?: Observable<boolean>;

    /** Vrai si l'utilisateur peut circuler librement dans l'application. */
    estLibre$(): Observable<boolean> {
        if (!this.cache) {
            this.cache = this.userService.profilContacts$().pipe(
                map((r: IResponse) => !((r.data?.profil as ProfilContact)?.correctionObligatoire ?? false)),
                // Le profil est indisponible : on laisse passer. Un incident de lecture ne doit
                // pas enfermer dehors tout un réseau.
                catchError(() => of(true)),
                shareReplay(1)
            );
        }
        return this.cache;
    }

    /** À appeler après une vérification réussie : l'état doit être relu. */
    invalider(): void {
        this.cache = undefined;
    }

    /** Relit l'état et met le cache à jour. */
    rafraichir(): Observable<boolean> {
        this.invalider();
        return this.estLibre$().pipe(tap(() => undefined));
    }
}

export const ContactsObligatoiresGuard: CanActivateFn = (_route, state): Observable<boolean | UrlTree> => {
    const router = inject(Router);
    const obligation = inject(ContactsObligationService);

    // La page de correction elle-même reste toujours atteignable, sinon la porte se ferme
    // sur l'utilisateur sans lui laisser le moyen de l'ouvrir.
    if (state.url.startsWith('/dashboards/mon-profil')) {
        return of(true);
    }
    return obligation.estLibre$().pipe(map((libre) => (libre ? true : router.createUrlTree(['/dashboards/mon-profil']))));
};
