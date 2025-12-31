import { inject, Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { IResponse } from '@/interface/response';
import { Key } from '@/enum/cache.key';
import { IAuthentication } from '@/interface/IAuthentication';
import { environment } from 'src/environments/environment';
import { ProcessCreditInd } from '@/interface/process.credit.ind';
import { Appreciation } from '@/interface/appreciation';
import { CreditRequest } from '@/interface/creditRequest';
import { Delegation } from '@/interface/delegation';
import { Agence } from '@/interface/agence';
import { MotifAnalyse } from '@/interface/motif.analyse';
import { DemandeUpdateRequest } from '@/interface/DemandeUpdateRequest';
import { CreateStockDto } from '@/interface/CreateStockDto';
import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { Avis } from '@/interface/avis';
import { PersonnePhysique } from '@/interface/personnePhysique';
import { ArreteCaisse } from '@/interface/arrete-caisse';

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

    //addDemandeInd$ = (demandeIndividuel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(tap(console.log), catchError(this.handleError));

    getAllAgencesByDelegationId$ = (delegationId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/agences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllPointVenteByAgenceId$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/listPointVenteByAgence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeAttente$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/attente`).pipe(tap(console.log), catchError(this.handleError));

    updateDemandeIndividuel$ = (statut: string, codUsuarios: string, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/update/${statut}/${codUsuarios}/${demandeindividuel_id}`, {}).pipe(tap(console.log), catchError(this.handleError));

    getDetailDemandeIndividuel$ = (demandeindividuel_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/detail/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));

    getListUsuariosByCodAgencia$ = (codAgencia: string, codPuesto: string, indActivo: string) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/getListUsuariosByCodAgencia/${codAgencia}/${codPuesto}/${indActivo}`).pipe(tap(console.log), catchError(this.handleError));

    getInformationAgence$ = (agenceId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/agence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));

    //getInfoPointService$ = (pointvente_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/pointvente/${pointvente_id}`).pipe(tap(console.log), catchError(this.handleError));

    getAllDemandeCreditByDate$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/selection`).pipe(tap(console.log), catchError(this.handleError));

    // add document pour la selection
    addDocuments$ = (demandeindividuelId: number, formData: FormData) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/image/${demandeindividuelId}`, formData).pipe(tap(console.log), catchError(this.handleError));

    getAllDocuments$ = (demandeindividuelId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/images/${demandeindividuelId}`).pipe(tap(console.log), catchError(this.handleError));

    deleteDocument$ = (selection_id: number, demandeindividuel_id: number) =>
        <Observable<IResponse>>this.http.delete<IResponse>(`${this.server}/ecredit/${selection_id}/${demandeindividuel_id}/delecteDocument`).pipe(tap(console.log), catchError(this.handleError));

    existNumeroMembre$ = (numeroMembre: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/existNumeroMembre/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

    addFicherSignaletique$ = (individuel: any, numeroMembre: string) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addIndividuel/${numeroMembre}`, individuel).pipe(tap(console.log), catchError(this.handleError));

    getLastDemandeInd$ = (numeroMembre: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/lastDemandeInd/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

    startCredit$ = (numeroMembre: string) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/startCredit/${numeroMembre}`, {}).pipe(tap(console.log), catchError(this.handleError));

    getInstanceCredit$ = (numeroMembre: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/credit/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

    processCreditInd$ = (referenceCredit: string, creditProcessParams: ProcessCreditInd, individuelId: number) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/process-credit/${referenceCredit}}/${individuelId}`, creditProcessParams).pipe(tap(console.log), catchError(this.handleError));

    getListCreditEnAttente$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/listCredit`).pipe(tap(console.log), catchError(this.handleError));

    viewInstanceCredit$ = (referenceCredit: string, numeroMembre: string, userId: number) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/viewCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    addNoteProfile$ = (referenceCredit: string, noteProfile: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteProfile/${referenceCredit}`, noteProfile).pipe(tap(console.log), catchError(this.handleError));

    addNoteAnalyse$ = (referenceCredit: string, noteAnalyse: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteAnalyse/${referenceCredit}`, noteAnalyse).pipe(tap(console.log), catchError(this.handleError));

    addNoteGarantie$ = (referenceCredit: string, noteGarantie: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addNoteGarantie/${referenceCredit}`, noteGarantie).pipe(tap(console.log), catchError(this.handleError));

    calculateNotesAndUpdateCredit(threshold: number, appreciation: Appreciation) {
        return this.http.post<IResponse>(`${this.server}/ecredit/calculate/${threshold}`, appreciation).pipe(catchError(this.handleError));
    }

    detailCreditInd$ = (referenceCredit: string, numeroMembre: string) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/viewDetailCredit/${referenceCredit}/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));

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

    getInfoAdministrative$ = (delegationId: number, agenceId: number, pointVenteId: number) =>
        <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/info/${delegationId}/${agenceId}/${pointVenteId}`).pipe(tap(console.log), catchError(this.handleError));

    // Get Information Credit Detailed
    getCreditDataDetailed$ = (referenceCredit: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/get-credit-detailed/${referenceCredit}`).pipe(tap(console.log), catchError(this.handleError));

    updateCreditDataPartial$ = (referenceCredit: string, individuelId: number, creditProcessParams: ProcessCreditInd) =>
        <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/update-credit-partial/${referenceCredit}/${individuelId}`, creditProcessParams).pipe(tap(console.log), catchError(this.handleError));

    addMotifAnalyse$ = (motifAnalyse: MotifAnalyse, demandeCreditId: number) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addMotif/${demandeCreditId}`, motifAnalyse).pipe(tap(console.log), catchError(this.handleError));

    obtenirAnalyseCompleteCredit$ = (demandeCreditId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/analyseComplete/${demandeCreditId}`).pipe(tap(console.log), catchError(this.handleError));

    updateAnalyseComplet$ = (demandeUpdateRequest: DemandeUpdateRequest) => <Observable<IResponse>>this.http.put<IResponse>(`${this.server}/ecredit/analyseComplet/update`, demandeUpdateRequest).pipe(tap(console.log), catchError(this.handleError));

    // Services pour la gestion des stocks
    createStock$ = (stockDto: CreateStockDto) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/stock`, stockDto).pipe(tap(console.log), catchError(this.handleError));

    updateStock$ = (idCmd: number, stockDto: any) => <Observable<IResponse>>this.http.put<IResponse>(`${this.server}/ecredit/stock/${idCmd}`, stockDto).pipe(tap(console.log), catchError(this.handleError));

    updateStockStatus$ = (idCmd: number, statusDto: any) => <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/stock/${idCmd}/status`, statusDto).pipe(tap(console.log), catchError(this.handleError));

    getAllStockEncours$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock/encours`).pipe(tap(console.log), catchError(this.handleError));

    getAllStock$ = (page: number = 0, size: number = 10) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock?page=${page}&size=${size}`).pipe(tap(console.log), catchError(this.handleError));

    getStockById$ = (idCmd: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock/${idCmd}`).pipe(tap(console.log), catchError(this.handleError));

    getStockByUser$ = (userId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock/user/${userId}`).pipe(tap(console.log), catchError(this.handleError));

    getStockStatistics$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock/statistics`).pipe(tap(console.log), catchError(this.handleError));

    approveStock$ = (idCmd: number, traitePar: number, observations?: string) =>
        <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/stock/${idCmd}/approve?traitePar=${traitePar}${observations ? '&observations=' + observations : ''}`, {}).pipe(tap(console.log), catchError(this.handleError));

    rejectStock$ = (idCmd: number, traitePar: number, motif: string, observations?: string) =>
        <Observable<IResponse>>(
            this.http.post<IResponse>(`${this.server}/ecredit/stock/${idCmd}/reject?traitePar=${traitePar}&motif=${motif}${observations ? '&observations=' + observations : ''}`, {}).pipe(tap(console.log), catchError(this.handleError))
        );

    getStockEncoursByDelegation$ = (delegationId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/stock/encours/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));

    getCategoriesStock$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/listCategorieStock`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Valider une commande
     */
    validateCommand(idCmd: number, observations?: string): Observable<any> {
        const body = {
            stateValidation: 'VALIDER',
            observations: observations || null
        };

        return this.http.put(`${this.server}/ecredit/update/stock/${idCmd}`, body);
    }

    /**
     * Rejeter une commande
     */
    rejectCommand(idCmd: number, motif: string, observations?: string): Observable<any> {
        const body = {
            stateValidation: 'REJETER',
            motif: motif,
            observations: observations || null
        };

        return this.http.put(`${this.server}/ecredit/update/stock/${idCmd}`, body);
    }

    /**
     * Alternative: Endpoints séparés si vous les préférez
     */
    validateCommandDirect(idCmd: number, observations?: string): Observable<any> {
        const body = observations ? { observations } : {};
        return this.http.put(`${this.server}/ecredit/validate/${idCmd}`, body);
    }

    rejectCommandDirect(idCmd: number, motif: string, observations?: string): Observable<any> {
        const body = {
            motif: motif,
            observations: observations || null
        };
        return this.http.put(`${this.server}/ecredit/reject/${idCmd}`, body);
    }

    // Analyse de credit
    getDossierCredit$ = (dossierId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/dossiers/${dossierId}`).pipe(tap(console.log), catchError(this.handleError));

    getClient$ = (clientId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/clients/${clientId}`).pipe(tap(console.log), catchError(this.handleError));

    getClients$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/clients`).pipe(tap(console.log), catchError(this.handleError));

    createClient$ = (clientData: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/clients`, clientData).pipe(tap(console.log), catchError(this.handleError));
    // Prévisions de trésorerie

    // ✅ Initialiser les prévisions pour un dossier
    initializePrevisions$ = (dossierId: number, nbMois: number = 12): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/dossiers/${dossierId}/previsions/init?nbMois=${nbMois}`, {}).pipe(tap(console.log), catchError(this.handleError));

    // ✅ Récupérer UNE prévision par son ID
    getPrevisionById$ = (previsionId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/previsions/${previsionId}`).pipe(tap(console.log), catchError(this.handleError));

    getPrevisionsTresorerie$ = (dossierId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/dossiers/${dossierId}/previsions`).pipe(tap(console.log), catchError(this.handleError));

    updatePrevisionsTresorerie$ = (dossierId: number, previsionData: any) => <Observable<IResponse>>this.http.put<IResponse>(`${this.server}/ecredit/previsions/${dossierId}`, previsionData).pipe(tap(console.log), catchError(this.handleError));

    importPrevisionsTresorerie$ = (dossierId: number, formData: FormData) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/previsions/${dossierId}/import`, formData).pipe(tap(console.log), catchError(this.handleError));

    exportPrevisionsTresorerie$ = (dossierId: number) => <Observable<Blob>>this.http.get(`${this.server}/ecredit/previsions/${dossierId}/export`, { responseType: 'blob' }).pipe(catchError(this.handleError));

    analyserCapaciteRemboursement$ = (dossierId: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/previsions/${dossierId}/analyse`).pipe(tap(console.log), catchError(this.handleError));

    getCategoriesEncaissement$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/categories/encaissement`).pipe(tap(console.log), catchError(this.handleError));

    getCategoriesDecaissement$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/categories/decaissement`).pipe(tap(console.log), catchError(this.handleError));

    // user.service.ts
    savePrevisionsTresorerie$ = (dossierId: number, previsions: any): Observable<IResponse> => {
        if (!dossierId || dossierId === 0) {
            return throwError(() => new Error('ID du dossier invalide'));
        }

        return this.http.post<IResponse>(`${this.server}/ecredit/dossiers/${dossierId}/previsions`, previsions).pipe(tap(console.log), catchError(this.handleError));
    };

    // Créer un dossier de crédit
    createDossierCredit$ = (dossierData: any): Observable<IResponse> => this.http.post<IResponse>(`${this.server}/ecredit/dossiers`, dossierData).pipe(tap(console.log), catchError(this.handleError));
    // Récupérer les dossiers d'un client
    getDossiersByClient$ = (clientId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/clients/${clientId}/dossiers`).pipe(tap(console.log), catchError(this.handleError));
    // Récupérer les lignes d'encaissement
    getLignesEncaissement$ = (previsionId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/previsions/${previsionId}/encaissements`).pipe(tap(console.log), catchError(this.handleError));

    // Récupérer les lignes de décaissement
    getLignesDecaissement$ = (previsionId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/previsions/${previsionId}/decaissements`).pipe(tap(console.log), catchError(this.handleError));

    saveEncaissements$ = (previsionId: number, lignes: any[]): Observable<IResponse> => this.http.post<IResponse>(`${this.server}/ecredit/previsions/${previsionId}/encaissements`, lignes).pipe(tap(console.log), catchError(this.handleError));

    saveDecaissements$ = (previsionId: number, lignes: any[]): Observable<IResponse> => this.http.post<IResponse>(`${this.server}/ecredit/previsions/${previsionId}/decaissements`, lignes).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Créer une nouvelle demande individuelle avec garanties
     * Utilise la procédure stockée pour insérer la demande et ses garanties
     * @param demandeIndividuel - Objet contenant toutes les informations de la demande et les garanties
     * @returns Observable<IResponse> avec l'ID de la demande créée
     */
    addDemandeIndWithGaranties$ = (demandeIndividuel: DemandeIndividuel): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(
            tap((response) => {
                console.log('Demande avec garanties créée:', response);
                if (response.data && response.data.demandeId) {
                    console.log('ID de la demande créée:', response.data.demandeId);
                }
            }),
            catchError(this.handleError)
        );

    /**
     * Récupérer une demande individuelle avec toutes ses garanties
     * @param demandeId - ID de la demande à récupérer
     * @returns Observable<IResponse> contenant la demande complète avec ses garanties
     */
    getDemandeWithGaranties$ = (demandeId: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/${demandeId}`).pipe(
            tap((response) => {
                console.log('Demande avec garanties récupérée:', response);
                if (response.data && response.data.demandeIndividuel) {
                    const garanties = response.data.demandeIndividuel.garanties;
                    console.log(`Nombre de garanties: ${garanties ? garanties.length : 0}`);
                }
            }),
            catchError(this.handleError)
        );

    /**
     * Récupérer toutes les demandes en attente avec leurs garanties
     * @param agenceId - ID de l'agence (optionnel)
     * @param pointventeId - ID du point de vente (optionnel)
     * @returns Observable<IResponse> contenant la liste des demandes
     */
    getDemandesEnAttenteWithGaranties$ = (agenceId?: number, pointventeId?: number): Observable<IResponse> => {
        let url = `${this.server}/ecredit/demandes/attente`;
        const params: string[] = [];

        if (agenceId) {
            params.push(`agenceId=${agenceId}`);
        }
        if (pointventeId) {
            params.push(`pointventeId=${pointventeId}`);
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return this.http.get<IResponse>(url).pipe(
            tap((response) => console.log('Demandes en attente avec garanties:', response)),
            catchError(this.handleError)
        );
    };

    /**
     * Mettre à jour le statut d'une demande avec garanties
     * @param demandeId - ID de la demande
     * @param statut - Nouveau statut
     * @param codUsuarios - Code de l'utilisateur effectuant la mise à jour
     * @returns Observable<IResponse>
     */
    updateStatutDemandeWithGaranties$ = (demandeId: number, statut: string, codUsuarios: string): Observable<IResponse> =>
        this.http.put<IResponse>(`${this.server}/ecredit/demandes/${demandeId}/statut?statut=${statut}&codUsuarios=${codUsuarios}`, {}).pipe(
            tap((response) => console.log('Statut de la demande mis à jour:', response)),
            catchError(this.handleError)
        );

    /**
     * Valider une demande avec ses garanties
     * @param demandeId - ID de la demande à valider
     * @returns Observable<IResponse>
     */
    validerDemandeWithGaranties$ = (demandeId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/demandes/${demandeId}/valider`, {}).pipe(
            tap((response) => console.log('Demande validée:', response)),
            catchError(this.handleError)
        );

    /**
     * Rejeter une demande avec ses garanties
     * @param demandeId - ID de la demande à rejeter
     * @param motif - Motif du rejet
     * @returns Observable<IResponse>
     */
    rejeterDemandeWithGaranties$ = (demandeId: number, motif: string): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/demandes/${demandeId}/rejeter`, { motif }).pipe(
            tap((response) => console.log('Demande rejetée:', response)),
            catchError(this.handleError)
        );

    /**
     * Obtenir les statistiques des garanties par type
     * @returns Observable<IResponse>
     */
    getStatistiquesGaranties$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/demandes/statistiques/garanties`).pipe(
            tap((response) => console.log('Statistiques des garanties:', response)),
            catchError(this.handleError)
        );

    /**
     * Rechercher des demandes avec garanties par critères
     * @param criteres - Objet contenant les critères de recherche
     * @returns Observable<IResponse>
     */
    searchDemandesWithGaranties$ = (criteres: { numeroMembre?: string; typeGarantie?: string; montantMin?: number; montantMax?: number; dateDebut?: string; dateFin?: string; statut?: string }): Observable<IResponse> => {
        const params = new URLSearchParams();
        Object.keys(criteres).forEach((key) => {
            const value = criteres[key as keyof typeof criteres];
            if (value !== undefined && value !== null && value !== '') {
                params.append(key, value.toString());
            }
        });

        return this.http.get<IResponse>(`${this.server}/ecredit/demandes/search?${params.toString()}`).pipe(
            tap((response) => console.log('Résultats de recherche:', response)),
            catchError(this.handleError)
        );
    };

    /**
     * Exporter les demandes avec garanties en Excel
     * @param filtres - Filtres à appliquer pour l'export
     * @returns Observable<Blob>
     */
    exportDemandesWithGaranties$ = (filtres?: { dateDebut?: string; dateFin?: string; statut?: string; agenceId?: number }): Observable<Blob> => {
        const params = new URLSearchParams();
        if (filtres) {
            Object.keys(filtres).forEach((key) => {
                const value = filtres[key as keyof typeof filtres];
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }

        return this.http.get(`${this.server}/ecredit/demandes/export?${params.toString()}`, { responseType: 'blob' }).pipe(
            tap(() => console.log('Export des demandes généré')),
            catchError(this.handleError)
        );
    };

    /**
     * Obtenir l'historique d'une demande avec garanties
     * @param demandeId - ID de la demande
     * @returns Observable<IResponse>
     */
    getHistoriqueDemandeWithGaranties$ = (demandeId: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/demandes/${demandeId}/historique`).pipe(
            tap((response) => console.log('Historique de la demande:', response)),
            catchError(this.handleError)
        );

    /**
     * Modifier les garanties d'une demande existante
     * @param demandeId - ID de la demande
     * @param garanties - Nouvelles garanties
     * @returns Observable<IResponse>
     */
    updateGarantiesDemande$ = (demandeId: number, garanties: any[]): Observable<IResponse> =>
        this.http.put<IResponse>(`${this.server}/ecredit/demandes/${demandeId}/garanties`, { garanties }).pipe(
            tap((response) => console.log('Garanties mises à jour:', response)),
            catchError(this.handleError)
        );

    /**
     * Calculer la capacité d'emprunt basée sur les garanties
     * @param garanties - Liste des garanties
     * @returns Observable<IResponse>
     */
    calculerCapaciteEmprunt$ = (garanties: any[]): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/ecredit/demandes/calculer-capacite`, { garanties }).pipe(
            tap((response) => console.log("Capacité d'emprunt calculée:", response)),
            catchError(this.handleError)
        );

    /**
     * @deprecated Utiliser addDemandeIndWithGaranties$ à la place
     * Ancienne méthode conservée pour compatibilité
     */
    addDemandeInd$ = (demandeIndividuel: any): Observable<IResponse> => {
        console.warn('addDemandeInd$ est déprécié. Utilisez addDemandeIndWithGaranties$ à la place.');
        return this.addDemandeIndWithGaranties$(demandeIndividuel);
    };

    /**
     * Récupérer toutes les demandes avec garanties selon les critères
     * @param agenceId - ID de l'agence (optionnel)
     * @param pointVenteId - ID du point de vente (optionnel)
     * @returns Observable<IResponse> contenant la liste des demandes avec leurs garanties
     */
    getAllDemandesWithGaranties$ = (agenceId?: number, pointVenteId?: number): Observable<IResponse> => {
        let url = `${this.server}/ecredit/all-with-garanties`;
        const params: string[] = [];

        if (agenceId) {
            params.push(`agenceId=${agenceId}`);
        }
        if (pointVenteId) {
            params.push(`pointVenteId=${pointVenteId}`);
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        return this.http.get<IResponse>(url).pipe(
            tap((response) => {
                console.log('Toutes les demandes avec garanties récupérées:', response);
                if (response.data && response.data.demandeAttentes) {
                    console.log(`Nombre total de demandes: ${response.data.count}`);
                }
            }),
            catchError(this.handleError)
        );
    };

    /**
     * Créer un nouvel avis
     */
    createAvis$(avis: Avis): Observable<IResponse> {
        return this.http.post<IResponse>(`${this.server}/ecredit/avis`, avis).pipe(catchError(this.handleError));
    }

    /**
     * Récupérer tous les avis d'une demande
     */
    getAvisByDemande$(demandeId: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/avis/demande/${demandeId}`).pipe(catchError(this.handleError));
    }

    /**
     * Mettre à jour un avis
     */
    updateAvis$(avisId: number, avis: Avis): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/avis/${avisId}`, avis).pipe(catchError(this.handleError));
    }

    /**
     * Supprimer un avis
     */
    deleteAvis$(avisId: number): Observable<IResponse> {
        return this.http.delete<IResponse>(`${this.server}/ecredit/avis/${avisId}`).pipe(catchError(this.handleError));
    }

    /**
     * Effectuer le rapprochement de caisse
     */
    checkReconciliation$(dateDebut: string, dateFin: string): Observable<IResponse> {
        const params = {
            dateDebut: dateDebut,
            dateFin: dateFin
        };
        return this.http.get<IResponse>(`${this.server}/ecredit/rapprochement/check`, { params }).pipe(catchError(this.handleError));
    }

    // Méthode pour rejeter une demande (spécifique au DA)
    rejectDemandeIndividuel$ = (demandeIndividuelId: number) =>
        <Observable<IResponse>>this.http.patch<IResponse>(`${this.server}/ecredit/update/${demandeIndividuelId}`, {}, { withCredentials: true }).pipe(tap(console.log), catchError(this.handleError));

    // Add these methods to your existing UserService
    // Correction annomalie
    getFicheSignaletique$ = (codCliente: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/fiche-signaletique/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));

    addPersonnePhysique$ = (personnePhysique: PersonnePhysique) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addPersonnePhysique`, personnePhysique).pipe(tap(console.log), catchError(this.handleError));

    getListPPAttente$ = (): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/listPPAttente`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupère la personne physique depuis PostgreSQL (Correction APRES)
     */
    getPersonnePhysique$ = (codCliente: string): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/personnePhysique/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Rejeter une correction avec motif
     */
    rejetCorrection$ = (motifCorrection: any): Observable<IResponse> => this.http.post<IResponse>(`${this.server}/ecredit/rejetCorrection`, motifCorrection).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Ajouter un motif de correction
     */
    addMotifCorrection$ = (motifCorrection: any): Observable<IResponse> => this.http.post<IResponse>(`${this.server}/ecredit/addMotifCorrection`, motifCorrection).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Update fiche signalétique in SAF SQL Server from PostgreSQL data
     */
    updateFicheSignaletique$ = (updateData: any): Observable<IResponse> => this.http.put<IResponse>(`${this.server}/ecredit/update/fiche-signaletique`, updateData).pipe(tap(console.log), catchError(this.handleError));

    // Mettre à jour la personne physique
    updatePersonnePhysique$(personnePhysique: PersonnePhysique): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/updatePersonnePhysique`, personnePhysique).pipe(tap(console.log), catchError(this.handleError));
    }
    /**
     * Récupère la fiche signalétique d'un client avec les soldes
     * @param codCliente Code du client
     * @returns Observable<IResponse> contenant la fiche signalétique avec soldes
     */
    getFicheSignaletiqueWithSolde$ = (codCliente: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/fiche-signaletique-with-solde/${codCliente}`).pipe(
            tap((response) => {
                console.log('Fiche signalétique avec soldes récupérée:', response);
                if (response.data?.metadata) {
                    console.log('Métadonnées:', response.data.metadata);
                }
            }),
            catchError(this.handleError)
        );

    /**
     * Récupérer la liste des agents de crédit par agence
     */
    getListAgentCredit$ = (agenceId: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/user/list/agent-credit/${agenceId}`).pipe(
            tap((response) => console.log('Liste agents crédit:', response)),
            catchError(this.handleError)
        );

    /**
     * Activer la rotation pour un agent
     */
    activateRotation$ = (rotationRequest: { userId: number; pointVenteId: number }): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/user/rotation/activate`, rotationRequest).pipe(
            tap((response) => console.log('Rotation activée:', response)),
            catchError(this.handleError)
        );

    /**
     * Désactiver la rotation pour un agent
     */
    deactivateRotation$ = (userId: number): Observable<IResponse> =>
        this.http.post<IResponse>(`${this.server}/user/rotation/deactivate/${userId}`, {}).pipe(
            tap((response) => console.log('Rotation désactivée:', response)),
            catchError(this.handleError)
        );

    /**
     * Vérifier la disponibilité d'un agent sur un point de vente
     */
    checkAgentDisponibility$ = (userId: number, pointVenteId: number): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/user/disponibility/${userId}/${pointVenteId}`).pipe(
            tap((response) => console.log('Disponibilité agent:', response)),
            catchError(this.handleError)
        );
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

    getListPPRejet$ = (): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/listRejet`).pipe(tap(console.log), catchError(this.handleError));

    // ==================== SERVICES POUR LA SUGGESTION DE QUANTITÉ (DE) ====================

    /**
     * Suggérer une modification de quantité pour un bon validé par le DR
     * @param idCmd ID du bon de commande
     * @param suggestionDto DTO contenant la quantité suggérée et le motif
     */
    suggererQuantite$(idCmd: number, suggestionDto: { qteSuggeree: number; motifQte?: string; observations?: string; garderQuantite?: boolean }): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/stock/${idCmd}/suggestion-quantite`, suggestionDto).pipe(
            tap((response) => console.log('Suggestion de quantité:', response)),
            catchError(this.handleError)
        );
    }

    getCorrectionStatsByDelegation$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/corrections/stats/delegations`).pipe(tap(console.log), catchError(this.handleError));

    getCorrectionStatsByAgence$ = (delegationId: number) => this.http.get<IResponse>(`${this.server}/ecredit/corrections/stats/delegations/${delegationId}/by-agency`).pipe(tap(console.log), catchError(this.handleError));

    getCorrectionStatsByPointVente$ = (agenceId: number) => this.http.get<IResponse>(`${this.server}/ecredit/corrections/stats/by-agency/${agenceId}/by-point`).pipe(tap(console.log), catchError(this.handleError));

    getCorrectionsByPointVente$ = (codeAgence: string, statut?: string) => {
        const url = `${this.server}/ecredit/corrections/pointvente/${codeAgence}/personnes${statut ? `?statut=${statut}` : ''}`;
        return <Observable<IResponse>>this.http.get<IResponse>(url).pipe(tap(console.log), catchError(this.handleError));
    };

    getCorrectionEvolutionByDay$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/corrections/evolution/by-day`).pipe(tap(console.log), catchError(this.handleError));

    getCorrectionEvolutionByWeek$ = () => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/corrections/evolution/by-week`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Garder la quantité actuelle sans modification
     * @param idCmd ID du bon de commande
     * @param observations Observations optionnelles
     */
    garderQuantite$(idCmd: number, observations?: string): Observable<IResponse> {
        const body = observations ? { observations } : {};
        return this.http.put<IResponse>(`${this.server}/ecredit/stock/${idCmd}/garder-quantite`, body).pipe(
            tap((response) => console.log('Quantité conservée:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Récupérer les bons validés par le DR pour une délégation (pour le DE)
     * @param delegationId ID de la délégation
     */
    getStockValidesPourDE$(delegationId: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/stock/valides-pour-de/${delegationId}`).pipe(
            tap((response) => console.log('Bons validés pour DE:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Récupérer tous les bons validés par le DR (toutes délégations)
     */
    getAllStockValidesPourDE$(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/stock/tous-valides-pour-de`).pipe(
            tap((response) => console.log('Tous les bons validés pour DE:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Validation finale par le DE
     * Passe le state_validation de 'VALIDE' à 'ACCEPTE'
     */
    validationFinaleDE$(idCmd: number, observations?: string): Observable<IResponse> {
        const body = observations ? { observations } : {};
        return this.http.put<IResponse>(`${this.server}/ecredit/stock/${idCmd}/validation-finale-de`, body).pipe(
            tap((response) => console.log('Validation finale DE:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Récupérer tous les bons acceptés par le DE pour la logistique
     */
    getStockAcceptesPourLogistique$(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/stock/acceptes-logistique`).pipe(
            tap((response) => console.log('Bons acceptés pour logistique:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Récupérer les bons acceptés par délégation pour la logistique
     */
    getStockAcceptesParDelegation$(delegationId: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/stock/acceptes-logistique/${delegationId}`).pipe(
            tap((response) => console.log('Bons acceptés par délégation:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Validation finale par la logistique
     * Change le status de 'ENCOURS' à 'ACCEPT'
     * Le bon disparaît de la vue logistique
     */
    validationLogistique$(idCmd: number, observations?: string): Observable<IResponse> {
        const body = observations ? { observations } : {};
        return this.http.put<IResponse>(`${this.server}/ecredit/stock/${idCmd}/validation-logistique`, body).pipe(
            tap((response) => console.log('Validation logistique:', response)),
            catchError(this.handleError)
        );
    }

    /**
     * Récupérer la synthèse des bons de commande par délégation
     */
    getSyntheseDelegations$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/synthese-delegations`).pipe(
            tap((response) => console.log('Synthèse délégations:', response)),
            catchError(this.handleError)
        );

    /**
     * Récupérer les bons de commande d'une délégation spécifique
     */
    getBonsCommandeParDelegation$ = (delegation: string): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/bons-commande-delegation?delegation=${encodeURIComponent(delegation)}`).pipe(
            tap((response) => console.log('Bons commande délégation:', response)),
            catchError(this.handleError)
        );

    // ==================== BACKOFFICE ETATS DOCUMENTS ====================

    /**
     * Récupérer toutes les délégations
     */
    getAllDelegationsBackoffice$ = (): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/backoffice/delegations`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer tous les états de documents (toutes délégations)
     */
    getAllEtatsDocuments$ = (page: number = 0, size: number = 20): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/backoffice/etats?page=${page}&size=${size}`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer les états par délégation
     */
    getEtatsByDelegation$ = (delegationId: number, page: number = 0, size: number = 20, statut?: string): Observable<IResponse> => {
        let url = `${this.server}/ecredit/backoffice/delegations/${delegationId}/etats?page=${page}&size=${size}`;
        if (statut) {
            url += `&statut=${statut}`;
        }
        return this.http.get<IResponse>(url).pipe(tap(console.log), catchError(this.handleError));
    };

    /**
     * Récupérer le détail d'un état
     */
    getEtatDocumentDetail$ = (etatId: number): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/backoffice/etats/${etatId}/detail`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Valider un état (ENCOURS -> VALIDE)
     */
    validerEtatDocument$ = (etatId: number): Observable<IResponse> => this.http.put<IResponse>(`${this.server}/ecredit/backoffice/etats/${etatId}/valider`, {}).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Accepter un état (VALIDE -> ACCEPTE)
     */
    accepterEtatDocument$ = (etatId: number): Observable<IResponse> => this.http.put<IResponse>(`${this.server}/ecredit/backoffice/etats/${etatId}/accepter`, {}).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Rejeter un état
     */
    rejeterEtatDocument$ = (etatId: number, motif?: string): Observable<IResponse> => this.http.put<IResponse>(`${this.server}/ecredit/backoffice/etats/${etatId}/rejeter`, { motif }).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer les statistiques par délégation
     */
    getStatsEtatsDocuments$ = (): Observable<IResponse> => this.http.get<IResponse>(`${this.server}/ecredit/backoffice/stats`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer la liste des crédits groupés par délégation
     * @returns Observable<IResponse> contenant la liste des crédits par délégation
     */
    getListCreditParDelegation$ = (): Observable<IResponse> =>
        this.http.get<IResponse>(`${this.server}/ecredit/listCreditParDelegation`).pipe(
            tap((response) => {
                console.log('Liste crédits par délégation:', response);
                if (response.data?.listCreditParDelegation) {
                    console.log(`Nombre de délégations: ${response.data.listCreditParDelegation.length}`);
                }
            }),
            catchError(this.handleError)
        );
    /**
     *  Functionnaly for logout
     */
    logOut(): void {
        localStorage.removeItem(Key.TOKEN);
        localStorage.removeItem(Key.REFRESH_TOKEN);
    }

    isTokenExpired = (): boolean => {
        const token = this.storage.get(Key.TOKEN);

        // Si pas de token ou token vide, considérer comme expiré
        if (!token || token === '' || token === 'null' || token === 'undefined') {
            return true;
        }

        try {
            const result = this.jwt.isTokenExpired(token);
            if (result instanceof Promise) {
                // If a Promise is returned, consider token as expired (or handle async if needed)
                console.warn('isTokenExpired returned a Promise, treating as expired.');
                return true;
            }
            return result;
        } catch (error) {
            console.error("Erreur lors de la vérification d'expiration du token:", error);
            return true; // En cas d'erreur, considérer comme expiré
        }
    };

    isAuthenticated = (): boolean => {
        const token = this.storage.get(Key.TOKEN);

        // Vérifier si le token existe ET n'est pas expiré
        if (!token || token === '' || token === 'null' || token === 'undefined') {
            return false;
        }

        try {
            return !this.jwt.isTokenExpired(token);
        } catch (error) {
            console.error("Erreur lors de la vérification d'authentification:", error);
            return false;
        }
    };

    // ========================================
    // AUTORISATION UTILISATEUR
    // ========================================

    /**
     * Mettre à jour l'autorisation d'un utilisateur
     */
    updateUserAuthorization$ = (userId: number, isAuthorized: boolean) => this.http.put<IResponse>(`${this.server}/user/authorization/${userId}?isAuthorized=${isAuthorized}`, {}).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer le statut d'autorisation d'un utilisateur
     */
    getUserAuthorizationStatus$ = (userId: number) => this.http.get<IResponse>(`${this.server}/user/authorization/${userId}/status`).pipe(tap(console.log), catchError(this.handleError));

    /**
     * Récupérer tous les utilisateurs par rôle
     */
    getUsersByRole$ = (roleName: string) => this.http.get<IResponse>(`${this.server}/user/by-role/${roleName}`).pipe(tap(console.log), catchError(this.handleError));

    // ==================== INFO PERSONNEL ====================

    /**
     * Importer le fichier du personnel (Excel)
     * Format attendu: Matricule | Nom | Prénom
     */
    importInfoPersonnel(file: File): Observable<IResponse> {
        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<IResponse>(`${this.server}/ecredit/salaire/import/info-personnel`, formData).pipe(catchError(this.handleError));
    }

    /**
     * Récupérer les personnels avec filtre optionnel par statut
     */
    getAllInfoPersonnel(statut?: string): Observable<IResponse> {
        const timestamp = new Date().getTime();
        let params = new HttpParams().set('_t', timestamp.toString());
        if (statut) {
            params = params.set('statut', statut);
        }
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel`, { params });
    }

    /**
     * Récupérer uniquement les personnels actifs
     */
    getActiveInfoPersonnel(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel/active`);
    }

    /**
     * Mettre à jour le statut d'un personnel
     */
    updateInfoPersonnelStatut(id: number, statut: string): Observable<IResponse> {
        const params = new HttpParams().set('statut', statut);
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/info-personnel/${id}/statut`, null, { params });
    }

    /**
     * Activer un personnel
     */
    activateInfoPersonnel(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/info-personnel/${id}/activate`, {});
    }

    /**
     * Désactiver un personnel
     */
    deactivateInfoPersonnel(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/info-personnel/${id}/deactivate`, {});
    }

    /**
     * Récupérer un personnel par matricule
     */
    getInfoPersonnelByMatricule(matricule: string): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel/matricule/${matricule}`);
    }

    /**
     * Récupérer un personnel par ID
     */
    getInfoPersonnelById(id: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel/${id}`).pipe(catchError(this.handleError));
    }

    /**
     * Compter le nombre de personnels
     */
    countInfoPersonnel(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel/count`).pipe(catchError(this.handleError));
    }

    /**
     * Mettre à jour le numéro de compte d'un personnel
     */
    updateNumeroCompte(matricule: string, numeroCompte: string): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/info-personnel/${matricule}/numero-compte`, null, { params: { numeroCompte } });
    }

    /**
     * Vérifier si le numéro de compte est défini pour un matricule
     */
    checkNumeroCompte(matricule: string): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/info-personnel/${matricule}/check-numero-compte`).pipe(catchError(this.handleError));
    }

    // ==================== AVANCE SALAIRE ====================

    /**
     * Importer le fichier des avances salaire (Excel)
     * Format attendu: Matricule | NET A PAYER
     */
    importAvanceSalaire(file: File): Observable<IResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<IResponse>(`${this.server}/ecredit/salaire/import/avance-salaire`, formData);
    }

    /**
     * Récupérer toutes les avances salaire
     */
    getAllAvanceSalaire(): Observable<IResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/avance-salaire?_t=${timestamp}`);
    }

    /**
     * Récupérer MON avance salaire (utilise le matricule du compte)
     */
    getMyAvanceSalaire(): Observable<IResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/me?_t=${timestamp}`);
    }
    /**
     * Récupérer les avances par utilisateur
     */
    getAvanceSalaireByUser(userId: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/user/${userId}`).pipe(catchError(this.handleError));
    }

    /**
     * Récupérer une avance par ID
     */
    getAvanceSalaireById(id: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/${id}`).pipe(catchError(this.handleError));
    }

    getAvanceSalaireByMatricule(matricule: string): Observable<IResponse> {
        return this.getAllAvanceSalaire().pipe(
            map((response) => {
                if (response.data?.avances) {
                    const avances = response.data.avances as any[];
                    const avance = avances.find((a) => a.matricule === matricule);

                    if (avance) {
                        // Créer une nouvelle réponse avec le bon type
                        const newResponse: IResponse = {
                            ...response,
                            data: {
                                ...response.data,
                                avance: avance
                            } as any
                        };
                        return newResponse;
                    }
                }
                // Simuler une erreur 404
                throw { status: 404, message: 'Aucune avance trouvée pour ce matricule' };
            })
        );
    }

    /**
     * Récupérer avances par statut
     */
    getAvanceSalaireByStatut(statut: string): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/statut/${statut}`).pipe(catchError(this.handleError));
    }

    /**
     * Mettre à jour le statut d'une avance
     */
    updateAvanceSalaireStatut(id: number, statut: string): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/${id}/statut?statut=${statut}`, {}).pipe(catchError(this.handleError));
    }

    /**
     * Supprimer toutes les avances d'un utilisateur
     */
    deleteAvanceSalaireByUser(userId: number): Observable<IResponse> {
        return this.http.delete<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/user/${userId}`).pipe(catchError(this.handleError));
    }

    /**
     * Vider la table avance_salaire (reset mensuel)
     */
    truncateAvanceSalaire(): Observable<IResponse> {
        return this.http.delete<IResponse>(`${this.server}/ecredit/salaire/avance-salaire/truncate`).pipe(catchError(this.handleError));
    }

    // ==================== DEMANDE SALARY ====================

    /**
     * Créer une demande d'avance sur salaire
     */
    createDemandeSalary(matricule: string, amount: number, numeroCompte?: string): Observable<IResponse> {
        let params = new HttpParams().set('matricule', matricule).set('amount', amount.toString());

        if (numeroCompte) {
            params = params.set('numeroCompte', numeroCompte);
        }

        return this.http.post<IResponse>(`${this.server}/ecredit/salaire/demande-salary`, null, { params });
    }

    /**
     * Récupérer toutes les demandes de salaire
     */
    getAllDemandeSalary(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/demande-salary`).pipe(catchError(this.handleError));
    }

    /**
     * Récupérer les demandes de salaire de l'utilisateur connecté
     */
    getMyDemandeSalary(): Observable<IResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/demande-salary/me?_t=${timestamp}`);
    }

    /**
     * Récupérer une demande par ID
     */
    getDemandeSalaryById(id: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/demande-salary/${id}`).pipe(catchError(this.handleError));
    }

    /**
     * Récupérer demandes par statut
     */
    getDemandeSalaryByStatut(statut: string): Observable<IResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/demande-salary/statut/${statut}?_t=${timestamp}`);
    }

    /**
     * Annuler une demande de salaire
     */
    annulerDemandeSalary(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/${id}/annuler`, {}).pipe(catchError(this.handleError));
    }

    /**
     * Rejeter une demande de salaire
     */
    rejeterDemandeSalary(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/${id}/rejeter`, {}).pipe(catchError(this.handleError));
    }

    /**
     * Valider une demande de salaire
     */
    validerDemandeSalary(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/${id}/valider`, {}).pipe(catchError(this.handleError));
    }

    /**
     * Confirmer une demande de salaire
     */
    confirmerDemandeSalary(id: number): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/${id}/confirmer`, {}).pipe(catchError(this.handleError));
    }

    /**
     * Créer MA demande d'avance (utilise le matricule du compte)
     */
    createMyDemandeSalary(amount: number, numeroCompte?: string): Observable<IResponse> {
        let params = new HttpParams().set('amount', amount.toString());

        if (numeroCompte) {
            params = params.set('numeroCompte', numeroCompte);
        }

        return this.http.post<IResponse>(`${this.server}/ecredit/salaire/demande-salary/me`, null, { params });
    }

    /**
     * Valider plusieurs demandes en une seule opération
     */
    validerMultipleDemandeSalary(ids: number[]): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/valider-multiple`, ids);
    }

    /**
     * Récupérer les demandes groupées par date
     */
    getDemandesGroupedByDate(statut: string): Observable<IResponse> {
        const timestamp = new Date().getTime();
        const params = new HttpParams().set('statut', statut).set('_t', timestamp.toString());
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/demande-salary/grouped-by-date`, { params });
    }

    /**
     * Confirmer plusieurs demandes en une seule opération (DF)
     */
    confirmerMultipleDemandeSalary(ids: number[]): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/demande-salary/confirmer-multiple`, ids);
    }

    /**
     * Exporter les demandes en Excel
     */
    exportDemandesExcel(ids?: number[]): Observable<Blob> {
        return this.http.post(`${this.server}/ecredit/salaire/demande-salary/export-excel`, ids || [], {
            responseType: 'blob'
        });
    }

    /**
     * Exporter toutes les demandes confirmées en Excel
     */
    exportAllConfirmedDemandesExcel(): Observable<Blob> {
        return this.http.get(`${this.server}/ecredit/salaire/demande-salary/export-excel/confirmer`, {
            responseType: 'blob'
        });
    }

    // ==================== AUTHORIZE SALAIRE ====================

    /**
     * Récupérer l'état d'autorisation des demandes
     */
    getAuthorizeSalaire(): Observable<IResponse> {
        const timestamp = new Date().getTime();
        return this.http.get<IResponse>(`${this.server}/ecredit/salaire/authorize?_t=${timestamp}`);
    }

    /**
     * Mettre à jour l'autorisation
     */
    updateAuthorizeSalaire(isAuthorized: boolean, message?: string): Observable<IResponse> {
        let params = new HttpParams().set('isAuthorized', isAuthorized.toString());
        if (message) {
            params = params.set('message', message);
        }
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/authorize`, null, { params });
    }

    /**
     * Activer les demandes
     */
    enableAuthorizeSalaire(): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/authorize/enable`, {});
    }

    /**
     * Désactiver les demandes
     */
    disableAuthorizeSalaire(): Observable<IResponse> {
        return this.http.put<IResponse>(`${this.server}/ecredit/salaire/authorize/disable`, {});
    }

    /**
     * Récupérer tous les arrêtés pour le suivi
     */
    getAllArretesForSuivi$(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/arrete-caisse/suivi`);
    }

    /**
     * Récupérer le dernier arrêté de chaque point de vente
     */
    getLatestArretesByPointvente$(): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.server}/ecredit/arrete-caisse/suivi/latest`);
    }

    /**
     * Helper: Parser une date (String ISO ou Array Java)
     */
    parseDate(date: string | number[] | null): Date | null {
        if (!date) return null;

        if (Array.isArray(date)) {
            // Format Java: [year, month, day, hour?, min?, sec?, nano?]
            const [year, month, day, hour = 0, minute = 0, second = 0] = date;
            return new Date(year, month - 1, day, hour, minute, second);
        }

        return new Date(date);
    }

    /**
     * Helper: Formater une date pour affichage
     */
    formatDate(date: string | number[] | null): string {
        const parsed = this.parseDate(date);
        if (!parsed) return '-';

        const day = parsed.getDate().toString().padStart(2, '0');
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const year = parsed.getFullYear();

        return `${day}/${month}/${year}`;
    }

    /**
     * Helper: Formater datetime pour affichage
     */
    formatDateTime(date: string | number[] | null): string {
        const parsed = this.parseDate(date);
        if (!parsed) return '-';

        const day = parsed.getDate().toString().padStart(2, '0');
        const month = (parsed.getMonth() + 1).toString().padStart(2, '0');
        const year = parsed.getFullYear();
        const hour = parsed.getHours().toString().padStart(2, '0');
        const minute = parsed.getMinutes().toString().padStart(2, '0');

        return `${day}/${month}/${year} ${hour}:${minute}`;
    }

    /**
     * Helper: Formater montant
     */
    formatMontant(montant: number): string {
        return new Intl.NumberFormat('fr-FR').format(montant) + ' GNF';
    }
}
