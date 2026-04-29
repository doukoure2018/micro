import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from '@/interface/response';
import { CreateDemandeTelephoneRequest, InspectionFiltre, RejetTelephoneRequest, ResoumissionTelephoneRequest } from '@/interface/demande-changement-telephone';

@Injectable({ providedIn: 'root' })
export class ChangementTelephoneService {
    private readonly base = `${environment.apiBaseUrl}/ecredit/changement-telephone`;
    private http = inject(HttpClient);

    creer(request: CreateDemandeTelephoneRequest): Observable<IResponse> {
        return this.http.post<IResponse>(this.base, request).pipe(catchError(this.handleError));
    }

    listAttenteDA(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/attente`).pipe(catchError(this.handleError));
    }

    listMesDemandes(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/mes-demandes`).pipe(catchError(this.handleError));
    }

    approuver(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/approuver`, {}).pipe(catchError(this.handleError));
    }

    rejeter(id: number, request: RejetTelephoneRequest): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/rejeter`, request).pipe(catchError(this.handleError));
    }

    resoumettre(id: number, request: ResoumissionTelephoneRequest): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/resoumettre`, request).pipe(catchError(this.handleError));
    }

    validerSaf(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.base}/${id}/valider-saf`, {}).pipe(catchError(this.handleError));
    }

    getDetail(id: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/${id}`).pipe(catchError(this.handleError));
    }

    getFicheClient(codCliente: string): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.base}/fiche-client/${encodeURIComponent(codCliente)}`).pipe(catchError(this.handleError));
    }

    getInspection(filtre: InspectionFiltre): Observable<IResponse> {
        let params = new HttpParams();
        if (filtre.delegationId != null) params = params.set('delegationId', String(filtre.delegationId));
        if (filtre.agenceId != null) params = params.set('agenceId', String(filtre.agenceId));
        if (filtre.pointVenteId != null) params = params.set('pointVenteId', String(filtre.pointVenteId));
        if (filtre.statut) params = params.set('statut', filtre.statut);
        return this.http.get<IResponse>(`${this.base}/inspection`, { params }).pipe(catchError(this.handleError));
    }

    private handleError(err: HttpErrorResponse) {
        const msg = err.error?.message || err.message || 'Erreur reseau';
        return throwError(() => new Error(msg));
    }
}
