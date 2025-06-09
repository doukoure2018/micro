import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '@/interface/response';
import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';
import { environment } from 'src/environments/environment';
import { ProcessCreditInd } from '@/interface/process.credit.ind';
import { Appreciation } from '@/interface/appreciation';
import { CreditRequest } from '@/interface/creditRequest';
import { Delegation } from '@/interface/delegation';
import { Agence } from '@/interface/agence';

@Injectable()
export class UserService {
    private readonly server: string = environment.apiBaseUrl;
    private readonly authorizationServer: string = environment.authServer;

    private jwt = new JwtHelperService();
    private storage = inject(StorageService);
    private http = inject(HttpClient);

    constructor() {}

    login(credentials: { username: string; password: string }) {
        return this.http.post<IResponse>(`${environment.authServer}/api/login`, credentials, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            withCredentials: true
        });
    }

    register$ = (user: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/register`, user).pipe(tap(console.log), catchError(this.handleError));

    verifyAccountToken$ = (token: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/verify/account?token=${token}`).pipe(tap(console.log), catchError(this.handleError));

    resetPassword$ = (form: FormData) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/resetpassword`, form).pipe(tap(console.log), catchError(this.handleError));

    verifyPasswordToken$ = (token: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/verify/password?token=${token}`).pipe(tap(console.log), catchError(this.handleError));

    createNewPassword$ = (request: { userUuid: string; token: string; password: string; confirmPassword: string }) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/resetpassword/reset`, request).pipe(tap(console.log), catchError(this.handleError));

    validateCode$ = (form: FormData) => <Observable<IAuthentication>>this.http.post<IAuthentication>(`${this.authorizationServer}/oauth2/token`, form).pipe(tap(console.log), catchError(this.handleError));

    getInstanceUser$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/instanceUser`).pipe(tap(console.log), catchError(this.handleError));

    profile$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/profile`).pipe(tap(console.log), catchError(this.handleError));

    getAllCreditos$ = (codCliente: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/seachCreditos/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));

    getAllPlanPagosByCreditos$ = (numCredito: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/getPlanPagos/${numCredito}`).pipe(tap(console.log), catchError(this.handleError));
    // Mise en place analyse de credit
    addPromoteur$ = (promoteurData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addPromoteur`, promoteurData).pipe(tap(console.log), catchError(this.handleError));
    addEntreprise$ = (entrepriseData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addEntreprise`, entrepriseData).pipe(tap(console.log), catchError(this.handleError));
    addBillanPersonnel$ = (bilanPersonnel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addBillanPersonnel`, bilanPersonnel).pipe(tap(console.log), catchError(this.handleError));
    addBilanEntreprise$ = (bilanEntreprise: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addBillanEntreprise`, bilanEntreprise).pipe(tap(console.log), catchError(this.handleError));
    addResultatBrutActuel$ = (compteExploitation: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addResultatBrutActuel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
    addResultatBrutPrevisionnel$ = (compteExploitation: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addResultatBrutPrevisionnel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    updateChargesActuelles$ = (compteExploitation: any) => <Observable<IResponse>>this.http.put<IResponse>(`${this.server}/ecredit/updateChargesActuelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    updateChargesPrevisionnelles$ = (compteExploitation: any) => <Observable<IResponse>>this.http.put<IResponse>(`${this.server}/ecredit/updateChargesPrevisionnelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    addDemandeCredit$ = (demandeCreditData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addDemandeCredit`, demandeCreditData).pipe(tap(console.log), catchError(this.handleError));

    submitCompleteDemande$ = (demande: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/submitCompleteDemande`, demande).pipe(tap(console.log), catchError(this.handleError));

    // fin Mise en place analyse de credit

    listUser$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/list`).pipe(tap(console.log), catchError(this.handleError));

    listRoles$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/roles`).pipe(tap(console.log), catchError(this.handleError));

    createAccount$ = (user: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/createAccount`, user).pipe(tap(console.log), catchError(this.handleError));

    searchClientes$ = (codeMembre: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/search?query=${codeMembre}`).pipe(tap(console.log), catchError(this.handleError));

    getTypeCreditos$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/typeCredit`).pipe(tap(console.log), catchError(this.handleError));

    addDemandeInd$ = (demandeIndividuel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(tap(console.log), catchError(this.handleError));

    getAllAgencesByDelegationId$ = (delegationId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/agences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllPointVenteByAgenceId$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/listPointVenteByAgence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeAttente$ = (pointventeId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/attente/${pointventeId}`).pipe(tap(console.log), catchError(this.handleError));

    updateDemandeIndividuel$ = (statut: string, codUsuarios: string, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/update/${statut}/${codUsuarios}/${demandeindividuel_id}`, {}).pipe(tap(console.log), catchError(this.handleError));

    getDetailDemandeIndividuel$ = (demandeindividuel_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/detail/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));

    getListUsuariosByCodAgencia$ = (codAgencia: string, codPuesto: string, indActivo: string) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/getListUsuariosByCodAgencia/${codAgencia}/${codPuesto}/${indActivo}`).pipe(tap(console.log), catchError(this.handleError));

    getInformationAgence$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/agence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    getInfoPointService$ = (pointvente_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/pointvente/${pointvente_id}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeCreditByDate$ = (pointventeId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/selection/${pointventeId}`).pipe(tap(console.log), catchError(this.handleError));

    // add document pour la selection
    addDocuments$ = (userId: number, demandeindividuel_id: number, formData: FormData) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/image/${userId}/${demandeindividuel_id}`, formData).pipe(tap(console.log), catchError(this.handleError));

    getAllDocuments$ = (demandeindividuel_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/images/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));

    deleteDocument$ = (selection_id: number, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.delete<IResponse>(`${this.server}/ecredit/${selection_id}/${demandeindividuel_id}/delecteDocument`).pipe(tap(console.log), catchError(this.handleError));

    existNumeroMembre$ = (numeroMembre: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/existNumeroMembre/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

    addFicherSignaletique$ = (individuel: any, numeroMembre: string) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addIndividuel/${numeroMembre}`, individuel).pipe(tap(console.log), catchError(this.handleError));

    getLastDemandeInd$ = (numeroMembre: string, userId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/lastDemandeInd/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    startCredit$ = (numeroMembre: string, userId: number) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/startCredit/${numeroMembre}/${userId}`, {}).pipe(tap(console.log), catchError(this.handleError));

    getInstanceCredit$ = (numeroMembre: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/credit/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

    processCreditInd$ = (referenceCredit: string, creditProcessParams: ProcessCreditInd, userId: number, individuelId: number) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/process-credit/${referenceCredit}/${userId}/${individuelId}`, creditProcessParams).pipe(tap(console.log), catchError(this.handleError));

    getListCreditEnAttente$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/listCredit/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    viewInstanceCredit$ = (referenceCredit: string, numeroMembre: string, userId: number) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/viewCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    addNoteProfile$ = (referenceCredit: string, noteProfile: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteProfile/${referenceCredit}`, noteProfile).pipe(tap(console.log), catchError(this.handleError));

    addNoteAnalyse$ = (referenceCredit: string, noteAnalyse: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteAnalyse/${referenceCredit}`, noteAnalyse).pipe(tap(console.log), catchError(this.handleError));

    addNoteGarantie$ = (referenceCredit: string, noteGarantie: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteGarantie/${referenceCredit}`, noteGarantie).pipe(tap(console.log), catchError(this.handleError));

    calculateNotesAndUpdateCredit(threshold: number, appreciation: Appreciation) {
        return this.http.post<IResponse>(`${this.server}/ecredit/calculate/${threshold}`, appreciation).pipe(catchError(this.handleError));
    }

    detailCreditInd$ = (referenceCredit: string, numeroMembre: string, userId: number) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/viewDetailCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    startMiseEnPlaceCredit$ = (referenceCredit: string, numeroMembre: string, userId: number) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/startInsertingCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    miseEnPlaceCredit$ = (referenceCredit: string, request: CreditRequest) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/processInsertingCredit/${referenceCredit}`, request).pipe(tap(console.log), catchError(this.handleError));

    updateInfoCredit$ = (referenceCredit: string) => <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/updateStateCredit/${referenceCredit}`, {}).pipe(tap(console.log), catchError(this.handleError));

    // Delegation
    addDelegation$ = (delegationForm: Delegation) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/addDelegation`, delegationForm).pipe(tap(console.log), catchError(this.handleError));

    getDelegationById$ = (id_delegation: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/delegation/${id_delegation}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDelegation$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/getAllDelegations`).pipe(tap(console.log), catchError(this.handleError));

    // Agence

    addAgence$ = (agenceForm: Agence) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/addAgence`, agenceForm).pipe(tap(console.log), catchError(this.handleError));

    getAllAgenceByDelegationId$ = (delegationId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/getAllAgences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));

    getAgenceById$ = (agence_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/agence/${agence_id}`).pipe(tap(console.log), catchError(this.handleError));

    //Point de service
    addPointeVente$ = (pointVenteForm: Agence) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/user/addPointVente`, pointVenteForm).pipe(tap(console.log), catchError(this.handleError));

    getAllPointventesByAgenceId$ = (agence_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/getAllPointVentes/${agence_id}`).pipe(tap(console.log), catchError(this.handleError));

    getPointVenteById$ = (idPs: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/pointvente/${idPs}`).pipe(tap(console.log), catchError(this.handleError));

    getUserSaf$ = (codUser: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/user/getUserSaf/${codUser}`).pipe(tap(console.log), catchError(this.handleError));

    listAnalyseCreditsEncours$ = (statut: string, userId?: number): Observable<IResponse> => {
        // Construire l'URL de base
        let url = `${this.server}/ecredit/getAllCreditOngoing/${statut}`;

        // Ajouter userId seulement s'il est valide
        if (userId && !isNaN(userId) && userId > 0) {
            url += `?userId=${userId}`;
        }

        return this.http.get<IResponse>(url).pipe(
            tap((response) => console.log('Réponse analyse crédits:', response)),
            catchError(this.handleError)
        );
    };

    obtenirResumeCredit$ = (demandeCreditId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/resumeCredit/${demandeCreditId}`).pipe(tap(console.log), catchError(this.handleError));

    startNewDemandeInd$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/newDemandeInd`).pipe(tap(console.log), catchError(this.handleError));

    handleError = (httpErrorResponse: HttpErrorResponse): Observable<never> => {
        console.log(httpErrorResponse);
        let error: string = 'An error occurred. Please try again.';
        if (httpErrorResponse.error instanceof ErrorEvent) {
            error = `A client error occurred - ${httpErrorResponse.error.message}`;
            return throwError(() => error);
        }
        if (httpErrorResponse.error.message) {
            error = `${httpErrorResponse.error.message}`;
            return throwError(() => error);
        }
        if (httpErrorResponse.error.error) {
            error = `Please login in again`;
            return throwError(() => error);
        }
        return throwError(() => error);
    };

    /**
     *  Functionnaly for logout
     */
    logOut(): void {
        localStorage.removeItem(Key.TOKEN);
        localStorage.removeItem(Key.REFRESH_TOKEN);
    }

    isAuthenticated = (): boolean => (this.jwt.decodeToken<string>(this.storage.get(Key.TOKEN)) ? true : false);
    isTokenExpired = (): boolean => this.jwt.isTokenExpired(this.storage.get(Key.TOKEN)) || false;
}
