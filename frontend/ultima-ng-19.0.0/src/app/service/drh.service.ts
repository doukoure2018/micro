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

export interface DemandeConge {
    demandeId: number;
    userId: number;
    nomComplet: string;
    matricule?: string;
    fonction?: string;
    departementId: number;
    departementCode: string;
    departementLibelle?: string;
    exercice: number;
    periodeId?: number;
    dateDebut: string;
    dateFin: string;
    nbJours: number;
    dejaPris: number;
    soldeApres: number;
    statut: string;
    commentaire?: string;
    motifRejet?: string;
    soumiseLe?: string;
    traiteeRespNom?: string;
    traiteeRespLe?: string;
    valideeDrhNom?: string;
    valideeDrhLe?: string;
    interrompueParNom?: string;
    interrompueLe?: string;
    dateReprise?: string;
    joursRecredites?: number;
    motifInterruption?: string;
}

export interface SoldeConge {
    exercice: number;
    droit: number;
    pris: number;
    restant: number;
    previsionValidee: boolean;
    tranchesDisponibles: PeriodePrevision[];
}

export interface PermissionSociale {
    permissionId: number;
    userId: number;
    nomComplet: string;
    matricule?: string;
    fonction?: string;
    departementId: number;
    departementCode: string;
    departementLibelle?: string;
    exercice: number;
    motif: string;
    lienParente?: string;
    precisionMotif?: string;
    dateDebut: string;
    dateFin: string;
    nbJours: number;
    statut: string;
    motifRejet?: string;
    soumiseLe?: string;
    traiteeRespNom?: string;
    traiteeRespLe?: string;
    valideeDrhNom?: string;
    valideeDrhLe?: string;
}

export interface QuotaPermission {
    exercice: number;
    quota: number;
    pris: number;
    restant: number;
    delaiPreavisJours: number;
    maxJoursParDemande?: number;
    enCours?: PermissionSociale;
}

/** Module DRH — phases 1-3 : organisation, prévisions, congés et permissions sociales. */
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

    joursFeries$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/jours-feries?exercice=${exercice}`).pipe(catchError(this.handleError));

    verifierMatricule$ = (matricule: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/personnel/${encodeURIComponent(matricule)}`).pipe(catchError(this.handleError));

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

    previsionsToutes$ = (exercice: number, departementId?: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/previsions/toutes?exercice=${exercice}` +
            (departementId ? `&departementId=${departementId}` : '')).pipe(catchError(this.handleError));

    validerPrevision$ = (previsionId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/valider`, {}).pipe(catchError(this.handleError));

    renvoyerPrevision$ = (previsionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/previsions/${previsionId}/renvoyer`, { motif }).pipe(catchError(this.handleError));

    // ===== Demandes de congé (phase 2) =====

    soldeConge$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/conges/solde?exercice=${exercice}`).pipe(catchError(this.handleError));

    mesConges$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/conges/moi?exercice=${exercice}`).pipe(catchError(this.handleError));

    creerConge$ = (body: { periodeId: number; dateDebut: string; dateFin: string; commentaire?: string }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges`, body).pipe(catchError(this.handleError));

    congesDepartement$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/conges/departement?exercice=${exercice}`).pipe(catchError(this.handleError));

    accepterConge$ = (demandeId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/accepter`, {}).pipe(catchError(this.handleError));

    rejeterConge$ = (demandeId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/rejeter`, { motif }).pipe(catchError(this.handleError));

    interrompreConge$ = (demandeId: number, body: { dateReprise: string; motif: string }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/interrompre`, body).pipe(catchError(this.handleError));

    annulerConge$ = (demandeId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/annuler`, { motif }).pipe(catchError(this.handleError));

    congesAValider$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/conges/a-valider?exercice=${exercice}`).pipe(catchError(this.handleError));

    validerConge$ = (demandeId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/valider`, {}).pipe(catchError(this.handleError));

    renvoyerConge$ = (demandeId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/conges/${demandeId}/renvoyer`, { motif }).pipe(catchError(this.handleError));

    // ===== Permissions sociales (phase 3) =====

    quotaPermission$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/permissions/quota?exercice=${exercice}`).pipe(catchError(this.handleError));

    mesPermissions$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/permissions/moi?exercice=${exercice}`).pipe(catchError(this.handleError));

    creerPermission$ = (body: { motif: string; lienParente?: string; precisionMotif?: string; dateDebut: string; dateFin: string }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions`, body).pipe(catchError(this.handleError));

    annulerPermission$ = (permissionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions/${permissionId}/annuler`, { motif }).pipe(catchError(this.handleError));

    permissionsDepartement$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/permissions/departement?exercice=${exercice}`).pipe(catchError(this.handleError));

    accepterPermission$ = (permissionId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions/${permissionId}/accepter`, {}).pipe(catchError(this.handleError));

    rejeterPermission$ = (permissionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions/${permissionId}/rejeter`, { motif }).pipe(catchError(this.handleError));

    permissionsAValider$ = (exercice: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/permissions/a-valider?exercice=${exercice}`).pipe(catchError(this.handleError));

    validerPermission$ = (permissionId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions/${permissionId}/valider`, {}).pipe(catchError(this.handleError));

    renvoyerPermission$ = (permissionId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/permissions/${permissionId}/renvoyer`, { motif }).pipe(catchError(this.handleError));

    // ===== Présences badgeuse (phase 4) =====

    importerPresences$ = (fichier: File): Observable<IResponse> => {
        const form = new FormData();
        form.append('file', fichier);
        return this.http.post<IResponse>(`${this.server}/ecredit/drh/presences/import`, form).pipe(catchError(this.handleError));
    };

    presences$ = (du: string, au: string, statut?: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/presences?du=${du}&au=${au}` +
            (statut ? `&statut=${statut}` : '')).pipe(catchError(this.handleError));

    synthesePresences$ = (du: string, au: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/presences/synthese?du=${du}&au=${au}`).pipe(catchError(this.handleError));

    pointagesNonRapproches$ = (du: string, au: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/drh/presences/non-rapproches?du=${du}&au=${au}`).pipe(catchError(this.handleError));

    recalculerPresences$ = (du: string, au: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/drh/presences/recalculer?du=${du}&au=${au}`, {}).pipe(catchError(this.handleError));
}
