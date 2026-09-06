import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResponse } from '@/interface/response';

export interface PeriodePrevision {
    periodeId?: number;
    dateDebut: string;
    dateFin: string;
    nbJours?: number;
}

export interface PrevisionConge {
    previsionId: number;
    userId: number;
    nomComplet: string;
    matricule?: string;
    fonction?: string;
    departementId: number;
    departementCode: string;
    exercice: number;
    statut: string;
    commentaire?: string;
    motifRejet?: string;
    soumiseLe?: string;
    traiteeRespNom?: string;
    traiteeRespLe?: string;
    valideeDrhNom?: string;
    valideeDrhLe?: string;
    totalJours: number;
    periodes: PeriodePrevision[];
}

export interface ContexteDrh {
    estMembre: boolean;
    estResponsable: boolean;
    estDrh: boolean;
    departementId?: number;
    departementCode?: string;
    departementLibelle?: string;
    droitAnnuelJours: number;
}

export interface DepartementDrh {
    departementId?: number;
    code: string;
    libelle: string;
    type: string;
    delegationId?: number;
    actif?: boolean;
    nbMembres?: number;
    responsables?: string;
}

export interface MembreDepartement {
    membreId: number;
    departementId: number;
    departementCode?: string;
    userId: number;
    nomComplet: string;
    username: string;
    matricule?: string;
    fonction?: string;
    estResponsable: boolean;
    dateAffectation?: string;
}

/** Module DRH — phase 1 : organisation par départements + prévisions de congés. */
@Injectable({ providedIn: 'root' })
export class DrhService {
    private readonly server: string = environment.apiBaseUrl;
    private http = inject(HttpClient);

    private handleError = (error: any) => throwError(() => error);

    contexte$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/contexte`).pipe(catchError(this.handleError));

    // Organisation
    departements$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/departements`).pipe(catchError(this.handleError));

    creerDepartement$ = (dep: DepartementDrh): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/departements`, dep).pipe(catchError(this.handleError));

    modifierDepartement$ = (id: number, dep: DepartementDrh): Observable<IResponse> =>
        this.http.put<IResponse>(`${this.server}/ecredit/drh/departements/${id}`, dep).pipe(catchError(this.handleError));

    membres$ = (departementId: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/departements/${departementId}/membres`).pipe(catchError(this.handleError));

    affecterMembre$ = (body: { departementId: number; userId: number; matricule?: string; fonction?: string; estResponsable: boolean }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/membres`, body).pipe(catchError(this.handleError));

    retirerMembre$ = (membreId: number): Observable<IResponse> =>
        this.http.delete<IResponse>(`${this.server}/ecredit/drh/membres/${membreId}`).pipe(catchError(this.handleError));

    usersNonAffectes$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/users-non-affectes`).pipe(catchError(this.handleError));

    // Prévision — agent
    maPrevision$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/previsions/moi?exercice=${exercice}`).pipe(catchError(this.handleError));

    enregistrerPrevision$ = (body: { exercice: number; commentaire?: string; periodes: PeriodePrevision[] }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions`, body).pipe(catchError(this.handleError));

    soumettrePrevision$ = (exercice: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/soumettre?exercice=${exercice}`, {}).pipe(catchError(this.handleError));

    // Prévision — responsable
    previsionsDepartement$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/previsions/departement?exercice=${exercice}`).pipe(catchError(this.handleError));

    accepterPrevision$ = (previsionId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/accepter`, {}).pipe(catchError(this.handleError));

    rejeterPrevision$ = (previsionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/rejeter`, { motif }).pipe(catchError(this.handleError));

    reajusterPrevision$ = (previsionId: number, body: { exercice: number; commentaire?: string; periodes: PeriodePrevision[] }): Observable<IResponse> =>
        this.http.put<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/reajuster`, body).pipe(catchError(this.handleError));

    // Prévision — DRH
    previsionsAValider$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/previsions/a-valider?exercice=${exercice}`).pipe(catchError(this.handleError));

    validerPrevision$ = (previsionId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/valider`, {}).pipe(catchError(this.handleError));

    renvoyerPrevision$ = (previsionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/renvoyer`, { motif }).pipe(catchError(this.handleError));
}
