import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from '@/interface/response';

/**
 * Les réclamations du terrain, côté directions.
 *
 * L'accès n'est borné par aucun rôle écrit ici : le serveur n'ouvre ces routes qu'aux porteurs
 * de la rubrique RECLAMATIONS — exactement ceux qui reçoivent le courriel peuvent répondre.
 */
@Injectable({ providedIn: 'root' })
export class ReclamationService {
    private readonly base = `${environment.apiBaseUrl}/ecredit/reclamations`;
    private readonly http = inject(HttpClient);

    file(statut?: string | null, categorie?: string | null): Observable<IResponse> {
        let params = new HttpParams();
        if (statut) params = params.set('statut', statut);
        if (categorie) params = params.set('categorie', categorie);
        return this.http.get<IResponse>(this.base, { params }).pipe(catchError(this.handleError));
    }

    categories(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/categories`).pipe(catchError(this.handleError));
    }

    /** « Je m'en occupe » : nomme celui qui prend la main, pour que six directions ne s'attendent pas. */
    prendreEnCharge(id: number): Observable<IResponse> {
        return this.http.post<IResponse>(`${this.base}/${id}/prise-en-charge`, {}).pipe(catchError(this.handleError));
    }

    repondre(id: number, reponse: string): Observable<IResponse> {
        return this.http.post<IResponse>(`${this.base}/${id}/reponse`, { reponse }).pipe(catchError(this.handleError));
    }

    private handleError(erreur: HttpErrorResponse): Observable<never> {
        if (erreur.error instanceof ErrorEvent) {
            return throwError(() => `Erreur client : ${erreur.error.message}`);
        }
        return throwError(() => erreur.error?.message || `Erreur ${erreur.status}`);
    }
}
