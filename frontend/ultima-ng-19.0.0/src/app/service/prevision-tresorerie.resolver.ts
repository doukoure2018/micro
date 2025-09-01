// prevision-tresorerie.resolver.ts
import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PrevisionTresorerieResolver implements Resolve<any> {
    private userService = inject(UserService);
    private router = inject(Router);

    resolve(route: ActivatedRouteSnapshot): Observable<any> {
        const dossierId = route.queryParams['dossierId'] || route.params['dossierId'];

        if (!dossierId) {
            // Si pas de dossier, retourner les params de base
            return of({
                clientId: route.queryParams['clientId'],
                clientNom: route.queryParams['clientNom'],
                montantCredit: +route.queryParams['montant'] || 0,
                duree: +route.queryParams['duree'] || 12,
                tauxInteret: +route.queryParams['taux'] || 0,
                dossierId: 0
            });
        }

        // Charger le dossier depuis l'API
        return this.userService.getDossierCredit$(+dossierId).pipe(
            map((response) => {
                if (response.data?.dossier) {
                    const dossier = response.data.dossier;
                    return {
                        clientId: dossier.clientId,
                        clientNom: dossier.clientNomComplet,
                        montantCredit: dossier.montantDemande,
                        duree: dossier.dureeMois,
                        tauxInteret: dossier.tauxInteret,
                        dossierId: dossier.id,
                        previsions: response.data.previsions
                    };
                }
                return null;
            }),
            catchError(() => {
                this.router.navigate(['/credit']);
                return of(null);
            })
        );
    }
}
