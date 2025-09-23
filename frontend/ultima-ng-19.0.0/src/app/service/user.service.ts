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
import { MotifAnalyse } from '@/interface/motif.analyse';
import { DemandeUpdateRequest } from '@/interface/DemandeUpdateRequest';
import { CreateStockDto } from '@/interface/CreateStockDto';
import { DemandeIndividuel } from '@/interface/demande-individuel.interface';
import { Avis } from '@/interface/avis';
import { PersonnePhysique } from '@/interface/PersonnePhysique';

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

    getFicheSignaletique$ = (codCliente: string) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ecredit/fiche-signaletique/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));

    addPersonnePhysique$ = (personnePhysique: PersonnePhysique) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addPersonnePhysique`, personnePhysique).pipe(tap(console.log), catchError(this.handleError));

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
}
