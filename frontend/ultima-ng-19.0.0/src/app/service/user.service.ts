import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { authorizationServer, server } from '@/utils/fileutils';
import { IResponse } from '@/interface/response';
import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';
import { Promoteur } from '@/interface/promoteur';
import { Entreprise } from '@/interface/entreprise';
import { BilanPersonnel } from '@/interface/bilan.personnel';
import { BilanEntreprise } from '@/interface/bilan.entreprise';
import { CompteExploitation } from '@/interface/compte.exploitation';
@Injectable()
export class UserService {
    private jwt = new JwtHelperService();
    private storage = inject(StorageService);
    private http = inject(HttpClient);

    constructor() {}

    register$ = (user: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/user/register`, user).pipe(tap(console.log), catchError(this.handleError));

    verifyAccountToken$ = (token: string) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/verify/account?token=${token}`).pipe(tap(console.log), catchError(this.handleError));

    resetPassword$ = (form: FormData) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/user/resetpassword`, form).pipe(tap(console.log), catchError(this.handleError));

    verifyPasswordToken$ = (token: string) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/verify/password?token=${token}`).pipe(tap(console.log), catchError(this.handleError));

    createNewPassword$ = (request: { userUuid: string; token: string; password: string; confirmPassword: string }) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${server}/user/resetpassword/reset`, request).pipe(tap(console.log), catchError(this.handleError));

    validateCode$ = (form: FormData) => <Observable<IAuthentication>>this.http.post<IAuthentication>(`${authorizationServer}/oauth2/token`, form).pipe(tap(console.log), catchError(this.handleError));

    getInstanceUser$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/instanceUser`).pipe(tap(console.log), catchError(this.handleError));

    profile$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/profile`).pipe(tap(console.log), catchError(this.handleError));

    getAllCreditos$ = (codCliente: string) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/${codCliente}/creditos`).pipe(tap(console.log), catchError(this.handleError));

    getAllPlanPagosByCreditos$ = (numCredito: string) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/${numCredito}/planPagos`).pipe(tap(console.log), catchError(this.handleError));
    // Mise en place analyse de credit
    addPromoteur$ = (promoteurData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addPromoteur`, promoteurData).pipe(tap(console.log), catchError(this.handleError));
    addEntreprise$ = (entrepriseData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addEntreprise`, entrepriseData).pipe(tap(console.log), catchError(this.handleError));
    addBillanPersonnel$ = (bilanPersonnel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addBillanPersonnel`, bilanPersonnel).pipe(tap(console.log), catchError(this.handleError));
    addBilanEntreprise$ = (bilanEntreprise: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addBillanEntreprise`, bilanEntreprise).pipe(tap(console.log), catchError(this.handleError));
    addResultatBrutActuel$ = (compteExploitation: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addResultatBrutActuel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
    addResultatBrutPrevisionnel$ = (compteExploitation: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addResultatBrutPrevisionnel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    updateChargesActuelles$ = (compteExploitation: any) => <Observable<IResponse>>this.http.put<IResponse>(`${server}/ecredit/updateChargesActuelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    updateChargesPrevisionnelles$ = (compteExploitation: any) => <Observable<IResponse>>this.http.put<IResponse>(`${server}/ecredit/updateChargesPrevisionnelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));

    addDemandeCredit$ = (demandeCreditData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addDemandeCredit`, demandeCreditData).pipe(tap(console.log), catchError(this.handleError));

    submitCompleteDemande$ = (demande: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/submitCompleteDemande`, demande).pipe(tap(console.log), catchError(this.handleError));

    // fin Mise en place analyse de credit

    listUser$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/list`).pipe(tap(console.log), catchError(this.handleError));

    listRoles$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/user/roles`).pipe(tap(console.log), catchError(this.handleError));

    createAccount$ = (user: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/user/createAccount`, user).pipe(tap(console.log), catchError(this.handleError));

    searchClientes$ = (codeMembre: string) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/search?query=${codeMembre}`).pipe(tap(console.log), catchError(this.handleError));

    getTypeCreditos$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/typeCredit`).pipe(tap(console.log), catchError(this.handleError));

    addDemandeInd$ = (demandeIndividuel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(tap(console.log), catchError(this.handleError));

    getAllDelegation$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/allDelegation`).pipe(tap(console.log), catchError(this.handleError));

    getAllAgencesByDelegationId$ = (delegationId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/agences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllPointVenteByAgenceId$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/pointventes/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeAttente$ = (pointventeId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ecredit/attente/${pointventeId}`).pipe(tap(console.log), catchError(this.handleError));

    updateDemandeIndividuel$ = (statut: string, codUsuarios: string, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.patch<IResponse>(`${server}/ecredit/update/${statut}/${codUsuarios}/${demandeindividuel_id}`, {}).pipe(tap(console.log), catchError(this.handleError));

    getDetailDemandeIndividuel$ = (demandeindividuel_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ecredit/detail/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));

    getListUsuariosByCodAgencia$ = (codAgencia: string, codPuesto: string, indActivo: string) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/${codAgencia}/${codPuesto}/${indActivo}/getListUsuariosByCodAgencia`).pipe(tap(console.log), catchError(this.handleError));

    getInformationAgence$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/agence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    getInfoPointService$ = (pointvente_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ebanking/pointvente/${pointvente_id}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeCreditByDate$ = (pointventeId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ecredit/selection/${pointventeId}`).pipe(tap(console.log), catchError(this.handleError));

    // add document pour la selection
    addDocuments$ = (userId: number, demandeindividuel_id: number, formData: FormData) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${server}/ecredit/image/${userId}/${demandeindividuel_id}`, formData).pipe(tap(console.log), catchError(this.handleError));

    getAllDocuments$ = (demandeindividuel_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${server}/ecredit/images/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));

    deleteDocument$ = (selection_id: number, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.delete<IResponse>(`${server}/ecredit/${selection_id}/${demandeindividuel_id}/delecteDocument`).pipe(tap(console.log), catchError(this.handleError));

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
