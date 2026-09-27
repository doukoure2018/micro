import { IResponse } from '@/interface/response';
import { CreateSignalementTelephoneRequest } from '@/interface/signalement-telephone';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Signalement d'un numéro de téléphone client depuis l'état TT1 (V156).
 * Le serveur impose le périmètre et les rôles : DA, DR et DE signalent, l'agent de crédit traite.
 */
@Injectable({ providedIn: 'root' })
export class SignalementTelephoneService {
    private readonly base = `${environment.apiBaseUrl}/ecredit/signalement-telephone`;
    private http = inject(HttpClient);

    signaler(request: CreateSignalementTelephoneRequest): Observable<IResponse> {
        return this.http.post<IResponse>(this.base, request).pipe(catchError(this.handleError));
    }

    /** Capacités de l'utilisateur + signalements ouverts du périmètre, indexés par code client. */
    capacitesEtOuverts(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/ouverts`).pipe(catchError(this.handleError));
    }

    /** Tous les signalements du périmètre (suivi du directeur). */
    listPerimetre(): Observable<IResponse> {
        return this.http.get<IResponse>(this.base).pipe(catchError(this.handleError));
    }

    /** Boîte de réception de l'agent de crédit. */
    listRecus(statut: string = 'TOUS'): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/recus`, { params: { statut } }).pipe(catchError(this.handleError));
    }

    compterNouveaux(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/recus/nouveaux`).pipe(catchError(this.handleError));
    }

    marquerVus(): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/recus/vus`, {}).pipe(catchError(this.handleError));
    }

    prendreEnCharge(id: number, demandeId: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/prendre-en-charge`, {}, { params: { demandeId } }).pipe(catchError(this.handleError));
    }

    classer(id: number, motif: string): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/classer`, { motif }).pipe(catchError(this.handleError));
    }

    private handleError = (error: HttpErrorResponse): Observable<never> => {
        let message = 'Une erreur est survenue, réessayez';
        if (error.error?.message) {
            message = error.error.message;
        } else if (error.status === 0) {
            message = 'Serveur injoignable, vérifiez votre connexion';
        }
        return throwError(() => message);
    };
}
