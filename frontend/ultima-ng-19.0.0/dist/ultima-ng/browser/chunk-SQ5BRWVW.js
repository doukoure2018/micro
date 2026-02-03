import {
  environment
} from "./chunk-ZRELZ6R7.js";
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpHeaders,
  HttpParams
} from "./chunk-BMYIFZHZ.js";
import {
  DOCUMENT
} from "./chunk-SQQPVFHK.js";
import {
  Inject,
  Injectable,
  InjectionToken,
  NgModule,
  Optional,
  SkipSelf,
  catchError,
  defer,
  inject,
  map,
  mergeMap,
  of,
  setClassMetadata,
  tap,
  throwError,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵinject
} from "./chunk-ZKKMBKIA.js";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-4MWRP73S.js";

// src/app/enum/cache.key.ts
var Key;
(function(Key2) {
  Key2["TOKEN"] = "[KEY] TOKEN";
  Key2["REFRESH_TOKEN"] = "[KEY] REFRESH_TOKEN";
  Key2["REDIRECT_URL"] = "[KEY] REDIRECT_URL";
})(Key || (Key = {}));

// src/app/service/storage.service.ts
var CLIENT_STORAGE = new InjectionToken("CLIENT_STORAGE", { factory: () => localStorage });
var StorageService = class _StorageService {
  storage;
  constructor(storage) {
    this.storage = storage;
  }
  // CORRECTION CRITIQUE : Parse le JSON et retourne null si pas trouvé
  get = (key) => {
    try {
      const item = this.storage.getItem(key);
      if (item === null) {
        return null;
      }
      try {
        return JSON.parse(item);
      } catch {
        return item;
      }
    } catch (error) {
      console.error("Erreur lors de la lecture du storage:", error);
      return null;
    }
  };
  set = (key, value) => {
    try {
      const stringValue = typeof value === "string" ? value : JSON.stringify(value);
      this.storage.setItem(key, stringValue);
    } catch (error) {
      console.error("Erreur lors de l'\xE9criture dans le storage:", error);
    }
  };
  remove = (key) => this.storage.removeItem(key);
  // CORRECTION : Utiliser la nouvelle méthode get
  getRedirectUrl = () => this.get(Key.REDIRECT_URL) || "";
  setRedirectUrl = (redirect_url) => this.set(Key.REDIRECT_URL, redirect_url);
  removeRedirectUrl = () => this.remove(Key.REDIRECT_URL);
  static \u0275fac = function StorageService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _StorageService)(\u0275\u0275inject(CLIENT_STORAGE));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _StorageService, factory: _StorageService.\u0275fac });
};

// node_modules/@auth0/angular-jwt/fesm2020/auth0-angular-jwt.mjs
var JWT_OPTIONS = new InjectionToken("JWT_OPTIONS");
var JwtHelperService = class {
  constructor(config = null) {
    this.tokenGetter = config && config.tokenGetter || function() {
    };
  }
  urlBase64Decode(str) {
    let output = str.replace(/-/g, "+").replace(/_/g, "/");
    switch (output.length % 4) {
      case 0: {
        break;
      }
      case 2: {
        output += "==";
        break;
      }
      case 3: {
        output += "=";
        break;
      }
      default: {
        throw new Error("Illegal base64url string!");
      }
    }
    return this.b64DecodeUnicode(output);
  }
  // credits for decoder goes to https://github.com/atk
  b64decode(str) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = "";
    str = String(str).replace(/=+$/, "");
    if (str.length % 4 === 1) {
      throw new Error(`'atob' failed: The string to be decoded is not correctly encoded.`);
    }
    for (
      let bc = 0, bs, buffer, idx = 0;
      // get next character
      buffer = str.charAt(idx++);
      // character found in table? initialize bit storage and add its ascii value;
      ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer, // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
    ) {
      buffer = chars.indexOf(buffer);
    }
    return output;
  }
  b64DecodeUnicode(str) {
    return decodeURIComponent(Array.prototype.map.call(this.b64decode(str), (c) => {
      return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(""));
  }
  decodeToken(token = this.tokenGetter()) {
    if (token instanceof Promise) {
      return token.then((t) => this._decodeToken(t));
    }
    return this._decodeToken(token);
  }
  _decodeToken(token) {
    if (!token || token === "") {
      return null;
    }
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error(`The inspected token doesn't appear to be a JWT. Check to make sure it has three parts and see https://jwt.io for more.`);
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error("Cannot decode the token.");
    }
    return JSON.parse(decoded);
  }
  getTokenExpirationDate(token = this.tokenGetter()) {
    if (token instanceof Promise) {
      return token.then((t) => this._getTokenExpirationDate(t));
    }
    return this._getTokenExpirationDate(token);
  }
  _getTokenExpirationDate(token) {
    let decoded;
    decoded = this.decodeToken(token);
    if (!decoded || !decoded.hasOwnProperty("exp")) {
      return null;
    }
    const date = /* @__PURE__ */ new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }
  isTokenExpired(token = this.tokenGetter(), offsetSeconds) {
    if (token instanceof Promise) {
      return token.then((t) => this._isTokenExpired(t, offsetSeconds));
    }
    return this._isTokenExpired(token, offsetSeconds);
  }
  _isTokenExpired(token, offsetSeconds) {
    if (!token || token === "") {
      return true;
    }
    const date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }
    return !(date.valueOf() > (/* @__PURE__ */ new Date()).valueOf() + offsetSeconds * 1e3);
  }
  getAuthScheme(authScheme, request) {
    if (typeof authScheme === "function") {
      return authScheme(request);
    }
    return authScheme;
  }
};
JwtHelperService.\u0275fac = function JwtHelperService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || JwtHelperService)(\u0275\u0275inject(JWT_OPTIONS));
};
JwtHelperService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: JwtHelperService,
  factory: JwtHelperService.\u0275fac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(JwtHelperService, [{
    type: Injectable
  }], function() {
    return [{
      type: void 0,
      decorators: [{
        type: Inject,
        args: [JWT_OPTIONS]
      }]
    }];
  }, null);
})();
var fromPromiseOrValue = (input) => {
  if (input instanceof Promise) {
    return defer(() => input);
  }
  return of(input);
};
var JwtInterceptor = class {
  constructor(config, jwtHelper, document) {
    this.jwtHelper = jwtHelper;
    this.document = document;
    this.standardPorts = ["80", "443"];
    this.tokenGetter = config.tokenGetter;
    this.headerName = config.headerName || "Authorization";
    this.authScheme = config.authScheme || config.authScheme === "" ? config.authScheme : "Bearer ";
    this.allowedDomains = config.allowedDomains || [];
    this.disallowedRoutes = config.disallowedRoutes || [];
    this.throwNoTokenError = config.throwNoTokenError || false;
    this.skipWhenExpired = config.skipWhenExpired;
  }
  isAllowedDomain(request) {
    const requestUrl = new URL(request.url, this.document.location.origin);
    if (requestUrl.host === this.document.location.host) {
      return true;
    }
    const hostName = `${requestUrl.hostname}${requestUrl.port && !this.standardPorts.includes(requestUrl.port) ? ":" + requestUrl.port : ""}`;
    return this.allowedDomains.findIndex((domain) => typeof domain === "string" ? domain === hostName : domain instanceof RegExp ? domain.test(hostName) : false) > -1;
  }
  isDisallowedRoute(request) {
    const requestedUrl = new URL(request.url, this.document.location.origin);
    return this.disallowedRoutes.findIndex((route) => {
      if (typeof route === "string") {
        const parsedRoute = new URL(route, this.document.location.origin);
        return parsedRoute.hostname === requestedUrl.hostname && parsedRoute.pathname === requestedUrl.pathname;
      }
      if (route instanceof RegExp) {
        return route.test(request.url);
      }
      return false;
    }) > -1;
  }
  handleInterception(token, request, next) {
    const authScheme = this.jwtHelper.getAuthScheme(this.authScheme, request);
    if (!token && this.throwNoTokenError) {
      throw new Error("Could not get token from tokenGetter function.");
    }
    let tokenIsExpired = of(false);
    if (this.skipWhenExpired) {
      tokenIsExpired = token ? fromPromiseOrValue(this.jwtHelper.isTokenExpired(token)) : of(true);
    }
    if (token) {
      return tokenIsExpired.pipe(map((isExpired) => isExpired && this.skipWhenExpired ? request.clone() : request.clone({
        setHeaders: {
          [this.headerName]: `${authScheme}${token}`
        }
      })), mergeMap((innerRequest) => next.handle(innerRequest)));
    }
    return next.handle(request);
  }
  intercept(request, next) {
    if (!this.isAllowedDomain(request) || this.isDisallowedRoute(request)) {
      return next.handle(request);
    }
    const token = this.tokenGetter(request);
    return fromPromiseOrValue(token).pipe(mergeMap((asyncToken) => {
      return this.handleInterception(asyncToken, request, next);
    }));
  }
};
JwtInterceptor.\u0275fac = function JwtInterceptor_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || JwtInterceptor)(\u0275\u0275inject(JWT_OPTIONS), \u0275\u0275inject(JwtHelperService), \u0275\u0275inject(DOCUMENT));
};
JwtInterceptor.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
  token: JwtInterceptor,
  factory: JwtInterceptor.\u0275fac
});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(JwtInterceptor, [{
    type: Injectable
  }], function() {
    return [{
      type: void 0,
      decorators: [{
        type: Inject,
        args: [JWT_OPTIONS]
      }]
    }, {
      type: JwtHelperService
    }, {
      type: Document,
      decorators: [{
        type: Inject,
        args: [DOCUMENT]
      }]
    }];
  }, null);
})();
var JwtModule = class _JwtModule {
  constructor(parentModule) {
    if (parentModule) {
      throw new Error(`JwtModule is already loaded. It should only be imported in your application's main module.`);
    }
  }
  static forRoot(options) {
    return {
      ngModule: _JwtModule,
      providers: [{
        provide: HTTP_INTERCEPTORS,
        useClass: JwtInterceptor,
        multi: true
      }, options.jwtOptionsProvider || {
        provide: JWT_OPTIONS,
        useValue: options.config
      }, JwtHelperService]
    };
  }
};
JwtModule.\u0275fac = function JwtModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || JwtModule)(\u0275\u0275inject(JwtModule, 12));
};
JwtModule.\u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
  type: JwtModule
});
JwtModule.\u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(JwtModule, [{
    type: NgModule
  }], function() {
    return [{
      type: JwtModule,
      decorators: [{
        type: Optional
      }, {
        type: SkipSelf
      }]
    }];
  }, null);
})();

// src/app/service/user.service.ts
var UserService = class _UserService {
  server = environment.apiBaseUrl;
  authorizationServer = environment.authServer;
  jwt = new JwtHelperService();
  storage = inject(StorageService);
  http = inject(HttpClient);
  constructor() {
  }
  login(credentials) {
    return this.http.post(`${environment.authServer}/api/login`, credentials, {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      }),
      withCredentials: true
    });
  }
  register$ = (user) => this.http.post(`${this.server}/user/register`, user).pipe(tap(console.log), catchError(this.handleError));
  verifyAccountToken$ = (token) => this.http.get(`${this.server}/user/verify/account?token=${token}`).pipe(tap(console.log), catchError(this.handleError));
  resetPassword$ = (form) => this.http.post(`${this.server}/user/resetpassword`, form).pipe(tap(console.log), catchError(this.handleError));
  verifyPasswordToken$ = (token) => this.http.get(`${this.server}/user/verify/password?token=${token}`).pipe(tap(console.log), catchError(this.handleError));
  createNewPassword$ = (request) => this.http.post(`${this.server}/user/resetpassword/reset`, request).pipe(tap(console.log), catchError(this.handleError));
  validateCode$ = (form) => this.http.post(`${this.authorizationServer}/oauth2/token`, form).pipe(tap(console.log), catchError(this.handleError));
  getInstanceUser$ = () => this.http.get(`${this.server}/user/instanceUser`).pipe(tap(console.log), catchError(this.handleError));
  profile$ = () => this.http.get(`${this.server}/user/profile`).pipe(tap(console.log), catchError(this.handleError));
  getAllCreditos$ = (codCliente) => this.http.get(`${this.server}/ecredit/seachCreditos/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));
  getAllPlanPagosByCreditos$ = (numCredito) => this.http.get(`${this.server}/ecredit/getPlanPagos/${numCredito}`).pipe(tap(console.log), catchError(this.handleError));
  // Mise en place analyse de credit
  addPromoteur$ = (promoteurData) => this.http.post(`${this.server}/ecredit/addPromoteur`, promoteurData).pipe(tap(console.log), catchError(this.handleError));
  addEntreprise$ = (entrepriseData) => this.http.post(`${this.server}/ecredit/addEntreprise`, entrepriseData).pipe(tap(console.log), catchError(this.handleError));
  addBillanPersonnel$ = (bilanPersonnel) => this.http.post(`${this.server}/ecredit/addBillanPersonnel`, bilanPersonnel).pipe(tap(console.log), catchError(this.handleError));
  addBilanEntreprise$ = (bilanEntreprise) => this.http.post(`${this.server}/ecredit/addBillanEntreprise`, bilanEntreprise).pipe(tap(console.log), catchError(this.handleError));
  addResultatBrutActuel$ = (compteExploitation) => this.http.post(`${this.server}/ecredit/addResultatBrutActuel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
  addResultatBrutPrevisionnel$ = (compteExploitation) => this.http.post(`${this.server}/ecredit/addResultatBrutPrevisionnel`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
  updateChargesActuelles$ = (compteExploitation) => this.http.put(`${this.server}/ecredit/updateChargesActuelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
  updateChargesPrevisionnelles$ = (compteExploitation) => this.http.put(`${this.server}/ecredit/updateChargesPrevisionnelles`, compteExploitation).pipe(tap(console.log), catchError(this.handleError));
  addDemandeCredit$ = (demandeCreditData) => this.http.post(`${this.server}/ecredit/addDemandeCredit`, demandeCreditData).pipe(tap(console.log), catchError(this.handleError));
  submitCompleteDemande$ = (demande) => this.http.post(`${this.server}/ecredit/submitCompleteDemande`, demande).pipe(tap(console.log), catchError(this.handleError));
  // fin Mise en place analyse de credit
  listUser$ = () => this.http.get(`${this.server}/user/list`).pipe(tap(console.log), catchError(this.handleError));
  listRoles$ = () => this.http.get(`${this.server}/user/roles`).pipe(tap(console.log), catchError(this.handleError));
  createAccount$ = (user) => this.http.post(`${this.server}/user/createAccount`, user).pipe(tap(console.log), catchError(this.handleError));
  searchClientes$ = (codeMembre) => this.http.get(`${this.server}/ecredit/search?query=${codeMembre}`).pipe(tap(console.log), catchError(this.handleError));
  getTypeCreditos$ = () => this.http.get(`${this.server}/ebanking/typeCredit`).pipe(tap(console.log), catchError(this.handleError));
  //addDemandeInd$ = (demandeIndividuel: any) => <Observable<IResponse>>this.http.post<IResponse>(`${this.server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(tap(console.log), catchError(this.handleError));
  getAllAgencesByDelegationId$ = (delegationId) => this.http.get(`${this.server}/ebanking/agences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));
  getAllPointVenteByAgenceId$ = (agenceId) => this.http.get(`${this.server}/ecredit/listPointVenteByAgence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));
  getAllDemandeAttente$ = () => this.http.get(`${this.server}/ecredit/attente`).pipe(tap(console.log), catchError(this.handleError));
  updateDemandeIndividuel$ = (statut, codUsuarios, demandeindividuel_id) => this.http.patch(`${this.server}/ecredit/update/${statut}/${codUsuarios}/${demandeindividuel_id}`, {}).pipe(tap(console.log), catchError(this.handleError));
  getDetailDemandeIndividuel$ = (demandeindividuel_id) => this.http.get(`${this.server}/ecredit/detail/${demandeindividuel_id}`).pipe(tap(console.log), catchError(this.handleError));
  getListUsuariosByCodAgencia$ = (codAgencia, codPuesto, indActivo) => this.http.get(`${this.server}/ecredit/getListUsuariosByCodAgencia/${codAgencia}/${codPuesto}/${indActivo}`).pipe(tap(console.log), catchError(this.handleError));
  getInformationAgence$ = (agenceId) => this.http.get(`${this.server}/ebanking/agence/${agenceId}`).pipe(tap(console.log), catchError(this.handleError));
  //getInfoPointService$ = (pointvente_id: number) => <Observable<IResponse>>this.http.get<IResponse>(`${this.server}/ebanking/pointvente/${pointvente_id}`).pipe(tap(console.log), catchError(this.handleError));
  getAllDemandeCreditByDate$ = () => this.http.get(`${this.server}/ecredit/selection`).pipe(tap(console.log), catchError(this.handleError));
  // add document pour la selection
  addDocuments$ = (demandeindividuelId, formData) => this.http.post(`${this.server}/ecredit/image/${demandeindividuelId}`, formData).pipe(tap(console.log), catchError(this.handleError));
  getAllDocuments$ = (demandeindividuelId) => this.http.get(`${this.server}/ecredit/images/${demandeindividuelId}`).pipe(tap(console.log), catchError(this.handleError));
  deleteDocument$ = (selection_id, demandeindividuel_id) => this.http.delete(`${this.server}/ecredit/${selection_id}/${demandeindividuel_id}/delecteDocument`).pipe(tap(console.log), catchError(this.handleError));
  existNumeroMembre$ = (numeroMembre) => this.http.get(`${this.server}/ecredit/existNumeroMembre/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));
  addFicherSignaletique$ = (individuel, numeroMembre) => this.http.post(`${this.server}/ecredit/addIndividuel/${numeroMembre}`, individuel).pipe(tap(console.log), catchError(this.handleError));
  getLastDemandeInd$ = (numeroMembre) => this.http.get(`${this.server}/ecredit/lastDemandeInd/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));
  startCredit$ = (numeroMembre) => this.http.post(`${this.server}/ecredit/startCredit/${numeroMembre}`, {}).pipe(tap(console.log), catchError(this.handleError));
  getInstanceCredit$ = (numeroMembre) => this.http.get(`${this.server}/ecredit/credit/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));
  processCreditInd$ = (referenceCredit, creditProcessParams, individuelId) => this.http.post(`${this.server}/ecredit/process-credit/${referenceCredit}}/${individuelId}`, creditProcessParams).pipe(tap(console.log), catchError(this.handleError));
  getListCreditEnAttente$ = () => this.http.get(`${this.server}/ecredit/listCredit`).pipe(tap(console.log), catchError(this.handleError));
  viewInstanceCredit$ = (referenceCredit, numeroMembre, userId) => this.http.get(`${this.server}/ecredit/viewCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));
  addNoteProfile$ = (referenceCredit, noteProfile) => this.http.post(`${this.server}/ecredit/addNoteProfile/${referenceCredit}`, noteProfile).pipe(tap(console.log), catchError(this.handleError));
  addNoteAnalyse$ = (referenceCredit, noteAnalyse) => this.http.post(`${this.server}/ecredit/addNoteAnalyse/${referenceCredit}`, noteAnalyse).pipe(tap(console.log), catchError(this.handleError));
  addNoteGarantie$ = (referenceCredit, noteGarantie) => this.http.post(`${this.server}/ecredit/addNoteGarantie/${referenceCredit}`, noteGarantie).pipe(tap(console.log), catchError(this.handleError));
  calculateNotesAndUpdateCredit(threshold, appreciation) {
    return this.http.post(`${this.server}/ecredit/calculate/${threshold}`, appreciation).pipe(catchError(this.handleError));
  }
  detailCreditInd$ = (referenceCredit, numeroMembre) => this.http.get(`${this.server}/ecredit/viewDetailCredit/${referenceCredit}/${numeroMembre}`).pipe(tap(console.log), catchError(this.handleError));
  startMiseEnPlaceCredit$ = (referenceCredit, numeroMembre, userId) => this.http.get(`${this.server}/ecredit/startInsertingCredit/${referenceCredit}/${numeroMembre}/${userId}`).pipe(tap(console.log), catchError(this.handleError));
  miseEnPlaceCredit$ = (referenceCredit, request) => this.http.post(`${this.server}/ecredit/processInsertingCredit/${referenceCredit}`, request).pipe(tap(console.log), catchError(this.handleError));
  updateInfoCredit$ = (referenceCredit) => this.http.patch(`${this.server}/ecredit/updateStateCredit/${referenceCredit}`, {}).pipe(tap(console.log), catchError(this.handleError));
  // Delegation
  addDelegation$ = (delegationForm) => this.http.post(`${this.server}/user/addDelegation`, delegationForm).pipe(tap(console.log), catchError(this.handleError));
  getDelegationById$ = (id_delegation) => this.http.get(`${this.server}/user/delegation/${id_delegation}`).pipe(tap(console.log), catchError(this.handleError));
  getAllDelegation$ = () => this.http.get(`${this.server}/user/getAllDelegations`).pipe(tap(console.log), catchError(this.handleError));
  // Agence
  addAgence$ = (agenceForm) => this.http.post(`${this.server}/user/addAgence`, agenceForm).pipe(tap(console.log), catchError(this.handleError));
  getAllAgenceByDelegationId$ = (delegationId) => this.http.get(`${this.server}/user/getAllAgences/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));
  getAgenceById$ = (agence_id) => this.http.get(`${this.server}/user/agence/${agence_id}`).pipe(tap(console.log), catchError(this.handleError));
  //Point de service
  addPointeVente$ = (pointVenteForm) => this.http.post(`${this.server}/user/addPointVente`, pointVenteForm).pipe(tap(console.log), catchError(this.handleError));
  getAllPointventesByAgenceId$ = (agence_id) => this.http.get(`${this.server}/user/getAllPointVentes/${agence_id}`).pipe(tap(console.log), catchError(this.handleError));
  getPointVenteById$ = (idPs) => this.http.get(`${this.server}/user/pointvente/${idPs}`).pipe(tap(console.log), catchError(this.handleError));
  getUserSaf$ = (codUser) => this.http.get(`${this.server}/user/getUserSaf/${codUser}`).pipe(tap(console.log), catchError(this.handleError));
  listAnalyseCreditsEncours$ = (statut, userId) => {
    let url = `${this.server}/ecredit/getAllCreditOngoing/${statut}`;
    if (userId && !isNaN(userId) && userId > 0) {
      url += `?userId=${userId}`;
    }
    return this.http.get(url).pipe(tap((response) => console.log("R\xE9ponse analyse cr\xE9dits:", response)), catchError(this.handleError));
  };
  obtenirResumeCredit$ = (demandeCreditId) => this.http.get(`${this.server}/ecredit/resumeCredit/${demandeCreditId}`).pipe(tap(console.log), catchError(this.handleError));
  // Synthèse de l'analyse financière (Bilan d'activité)
  getSyntheseAnalyseFinanciere$ = (demandeIndividuelId) => this.http.get(`${this.server}/ecredit/bilan_finance/synthese/demande/${demandeIndividuelId}`).pipe(tap(console.log), catchError(this.handleError));
  startNewDemandeInd$ = () => this.http.get(`${this.server}/ecredit/newDemandeInd`).pipe(tap(console.log), catchError(this.handleError));
  getInfoAdministrative$ = (delegationId, agenceId, pointVenteId) => this.http.get(`${this.server}/ecredit/info/${delegationId}/${agenceId}/${pointVenteId}`).pipe(tap(console.log), catchError(this.handleError));
  // Get Information Credit Detailed
  getCreditDataDetailed$ = (referenceCredit) => this.http.get(`${this.server}/ecredit/get-credit-detailed/${referenceCredit}`).pipe(tap(console.log), catchError(this.handleError));
  updateCreditDataPartial$ = (referenceCredit, individuelId, creditProcessParams) => this.http.patch(`${this.server}/ecredit/update-credit-partial/${referenceCredit}/${individuelId}`, creditProcessParams).pipe(tap(console.log), catchError(this.handleError));
  addMotifAnalyse$ = (motifAnalyse, demandeCreditId) => this.http.post(`${this.server}/ecredit/addMotif/${demandeCreditId}`, motifAnalyse).pipe(tap(console.log), catchError(this.handleError));
  obtenirAnalyseCompleteCredit$ = (demandeCreditId) => this.http.get(`${this.server}/ecredit/analyseComplete/${demandeCreditId}`).pipe(tap(console.log), catchError(this.handleError));
  updateAnalyseComplet$ = (demandeUpdateRequest) => this.http.put(`${this.server}/ecredit/analyseComplet/update`, demandeUpdateRequest).pipe(tap(console.log), catchError(this.handleError));
  // Services pour la gestion des stocks
  createStock$ = (stockDto) => this.http.post(`${this.server}/ecredit/stock`, stockDto).pipe(tap(console.log), catchError(this.handleError));
  updateStock$ = (idCmd, stockDto) => this.http.put(`${this.server}/ecredit/stock/${idCmd}`, stockDto).pipe(tap(console.log), catchError(this.handleError));
  updateStockStatus$ = (idCmd, statusDto) => this.http.patch(`${this.server}/ecredit/stock/${idCmd}/status`, statusDto).pipe(tap(console.log), catchError(this.handleError));
  getAllStockEncours$ = () => this.http.get(`${this.server}/ecredit/stock/encours`).pipe(tap(console.log), catchError(this.handleError));
  getAllStock$ = (page = 0, size = 10) => this.http.get(`${this.server}/ecredit/stock?page=${page}&size=${size}`).pipe(tap(console.log), catchError(this.handleError));
  getStockById$ = (idCmd) => this.http.get(`${this.server}/ecredit/stock/${idCmd}`).pipe(tap(console.log), catchError(this.handleError));
  getStockByUser$ = (userId) => this.http.get(`${this.server}/ecredit/stock/user/${userId}`).pipe(tap(console.log), catchError(this.handleError));
  getStockStatistics$ = () => this.http.get(`${this.server}/ecredit/stock/statistics`).pipe(tap(console.log), catchError(this.handleError));
  approveStock$ = (idCmd, traitePar, observations) => this.http.post(`${this.server}/ecredit/stock/${idCmd}/approve?traitePar=${traitePar}${observations ? "&observations=" + observations : ""}`, {}).pipe(tap(console.log), catchError(this.handleError));
  rejectStock$ = (idCmd, traitePar, motif, observations) => this.http.post(`${this.server}/ecredit/stock/${idCmd}/reject?traitePar=${traitePar}&motif=${motif}${observations ? "&observations=" + observations : ""}`, {}).pipe(tap(console.log), catchError(this.handleError));
  getStockEncoursByDelegation$ = (delegationId) => this.http.get(`${this.server}/ecredit/stock/encours/${delegationId}`).pipe(tap(console.log), catchError(this.handleError));
  getCategoriesStock$ = () => this.http.get(`${this.server}/ecredit/listCategorieStock`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Valider une commande
   */
  validateCommand(idCmd, observations) {
    const body = {
      stateValidation: "VALIDER",
      observations: observations || null
    };
    return this.http.put(`${this.server}/ecredit/update/stock/${idCmd}`, body);
  }
  /**
   * Rejeter une commande
   */
  rejectCommand(idCmd, motif, observations) {
    const body = {
      stateValidation: "REJETER",
      motif,
      observations: observations || null
    };
    return this.http.put(`${this.server}/ecredit/update/stock/${idCmd}`, body);
  }
  /**
   * Alternative: Endpoints séparés si vous les préférez
   */
  validateCommandDirect(idCmd, observations) {
    const body = observations ? { observations } : {};
    return this.http.put(`${this.server}/ecredit/validate/${idCmd}`, body);
  }
  rejectCommandDirect(idCmd, motif, observations) {
    const body = {
      motif,
      observations: observations || null
    };
    return this.http.put(`${this.server}/ecredit/reject/${idCmd}`, body);
  }
  // Analyse de credit
  getDossierCredit$ = (dossierId) => this.http.get(`${this.server}/ecredit/dossiers/${dossierId}`).pipe(tap(console.log), catchError(this.handleError));
  getClient$ = (clientId) => this.http.get(`${this.server}/ecredit/clients/${clientId}`).pipe(tap(console.log), catchError(this.handleError));
  getClients$ = () => this.http.get(`${this.server}/ecredit/clients`).pipe(tap(console.log), catchError(this.handleError));
  createClient$ = (clientData) => this.http.post(`${this.server}/ecredit/clients`, clientData).pipe(tap(console.log), catchError(this.handleError));
  // Prévisions de trésorerie
  // ✅ Initialiser les prévisions pour un dossier
  initializePrevisions$ = (dossierId, nbMois = 12) => this.http.post(`${this.server}/ecredit/dossiers/${dossierId}/previsions/init?nbMois=${nbMois}`, {}).pipe(tap(console.log), catchError(this.handleError));
  // ✅ Récupérer UNE prévision par son ID
  getPrevisionById$ = (previsionId) => this.http.get(`${this.server}/ecredit/previsions/${previsionId}`).pipe(tap(console.log), catchError(this.handleError));
  getPrevisionsTresorerie$ = (dossierId) => this.http.get(`${this.server}/ecredit/dossiers/${dossierId}/previsions`).pipe(tap(console.log), catchError(this.handleError));
  updatePrevisionsTresorerie$ = (dossierId, previsionData) => this.http.put(`${this.server}/ecredit/previsions/${dossierId}`, previsionData).pipe(tap(console.log), catchError(this.handleError));
  importPrevisionsTresorerie$ = (dossierId, formData) => this.http.post(`${this.server}/ecredit/previsions/${dossierId}/import`, formData).pipe(tap(console.log), catchError(this.handleError));
  exportPrevisionsTresorerie$ = (dossierId) => this.http.get(`${this.server}/ecredit/previsions/${dossierId}/export`, { responseType: "blob" }).pipe(catchError(this.handleError));
  analyserCapaciteRemboursement$ = (dossierId) => this.http.get(`${this.server}/ecredit/previsions/${dossierId}/analyse`).pipe(tap(console.log), catchError(this.handleError));
  getCategoriesEncaissement$ = () => this.http.get(`${this.server}/ecredit/categories/encaissement`).pipe(tap(console.log), catchError(this.handleError));
  getCategoriesDecaissement$ = () => this.http.get(`${this.server}/ecredit/categories/decaissement`).pipe(tap(console.log), catchError(this.handleError));
  // user.service.ts
  savePrevisionsTresorerie$ = (dossierId, previsions) => {
    if (!dossierId || dossierId === 0) {
      return throwError(() => new Error("ID du dossier invalide"));
    }
    return this.http.post(`${this.server}/ecredit/dossiers/${dossierId}/previsions`, previsions).pipe(tap(console.log), catchError(this.handleError));
  };
  // Créer un dossier de crédit
  createDossierCredit$ = (dossierData) => this.http.post(`${this.server}/ecredit/dossiers`, dossierData).pipe(tap(console.log), catchError(this.handleError));
  // Récupérer les dossiers d'un client
  getDossiersByClient$ = (clientId) => this.http.get(`${this.server}/ecredit/clients/${clientId}/dossiers`).pipe(tap(console.log), catchError(this.handleError));
  // Récupérer les lignes d'encaissement
  getLignesEncaissement$ = (previsionId) => this.http.get(`${this.server}/ecredit/previsions/${previsionId}/encaissements`).pipe(tap(console.log), catchError(this.handleError));
  // Récupérer les lignes de décaissement
  getLignesDecaissement$ = (previsionId) => this.http.get(`${this.server}/ecredit/previsions/${previsionId}/decaissements`).pipe(tap(console.log), catchError(this.handleError));
  saveEncaissements$ = (previsionId, lignes) => this.http.post(`${this.server}/ecredit/previsions/${previsionId}/encaissements`, lignes).pipe(tap(console.log), catchError(this.handleError));
  saveDecaissements$ = (previsionId, lignes) => this.http.post(`${this.server}/ecredit/previsions/${previsionId}/decaissements`, lignes).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Créer une nouvelle demande individuelle avec garanties
   * Utilise la procédure stockée pour insérer la demande et ses garanties
   * @param demandeIndividuel - Objet contenant toutes les informations de la demande et les garanties
   * @returns Observable<IResponse> avec l'ID de la demande créée
   */
  addDemandeIndWithGaranties$ = (demandeIndividuel) => this.http.post(`${this.server}/ecredit/addDemandeInd`, demandeIndividuel).pipe(tap((response) => {
    console.log("Demande avec garanties cr\xE9\xE9e:", response);
    if (response.data && response.data.demandeId) {
      console.log("ID de la demande cr\xE9\xE9e:", response.data.demandeId);
    }
  }), catchError(this.handleError));
  /**
   * Récupérer une demande individuelle avec toutes ses garanties
   * @param demandeId - ID de la demande à récupérer
   * @returns Observable<IResponse> contenant la demande complète avec ses garanties
   */
  getDemandeWithGaranties$ = (demandeId) => this.http.get(`${this.server}/ecredit/${demandeId}`).pipe(tap((response) => {
    console.log("Demande avec garanties r\xE9cup\xE9r\xE9e:", response);
    if (response.data && response.data.demandeIndividuel) {
      const garanties = response.data.demandeIndividuel.garanties;
      console.log(`Nombre de garanties: ${garanties ? garanties.length : 0}`);
    }
  }), catchError(this.handleError));
  /**
   * Récupérer toutes les demandes en attente avec leurs garanties
   * @param agenceId - ID de l'agence (optionnel)
   * @param pointventeId - ID du point de vente (optionnel)
   * @returns Observable<IResponse> contenant la liste des demandes
   */
  getDemandesEnAttenteWithGaranties$ = (agenceId, pointventeId) => {
    let url = `${this.server}/ecredit/demandes/attente`;
    const params = [];
    if (agenceId) {
      params.push(`agenceId=${agenceId}`);
    }
    if (pointventeId) {
      params.push(`pointventeId=${pointventeId}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    return this.http.get(url).pipe(tap((response) => console.log("Demandes en attente avec garanties:", response)), catchError(this.handleError));
  };
  /**
   * Mettre à jour le statut d'une demande avec garanties
   * @param demandeId - ID de la demande
   * @param statut - Nouveau statut
   * @param codUsuarios - Code de l'utilisateur effectuant la mise à jour
   * @returns Observable<IResponse>
   */
  updateStatutDemandeWithGaranties$ = (demandeId, statut, codUsuarios) => this.http.put(`${this.server}/ecredit/demandes/${demandeId}/statut?statut=${statut}&codUsuarios=${codUsuarios}`, {}).pipe(tap((response) => console.log("Statut de la demande mis \xE0 jour:", response)), catchError(this.handleError));
  /**
   * Valider une demande avec ses garanties
   * @param demandeId - ID de la demande à valider
   * @returns Observable<IResponse>
   */
  validerDemandeWithGaranties$ = (demandeId) => this.http.post(`${this.server}/ecredit/demandes/${demandeId}/valider`, {}).pipe(tap((response) => console.log("Demande valid\xE9e:", response)), catchError(this.handleError));
  /**
   * Rejeter une demande avec ses garanties
   * @param demandeId - ID de la demande à rejeter
   * @param motif - Motif du rejet
   * @returns Observable<IResponse>
   */
  rejeterDemandeWithGaranties$ = (demandeId, motif) => this.http.post(`${this.server}/ecredit/demandes/${demandeId}/rejeter`, { motif }).pipe(tap((response) => console.log("Demande rejet\xE9e:", response)), catchError(this.handleError));
  /**
   * Obtenir les statistiques des garanties par type
   * @returns Observable<IResponse>
   */
  getStatistiquesGaranties$ = () => this.http.get(`${this.server}/ecredit/demandes/statistiques/garanties`).pipe(tap((response) => console.log("Statistiques des garanties:", response)), catchError(this.handleError));
  /**
   * Rechercher des demandes avec garanties par critères
   * @param criteres - Objet contenant les critères de recherche
   * @returns Observable<IResponse>
   */
  searchDemandesWithGaranties$ = (criteres) => {
    const params = new URLSearchParams();
    Object.keys(criteres).forEach((key) => {
      const value = criteres[key];
      if (value !== void 0 && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });
    return this.http.get(`${this.server}/ecredit/demandes/search?${params.toString()}`).pipe(tap((response) => console.log("R\xE9sultats de recherche:", response)), catchError(this.handleError));
  };
  /**
   * Exporter les demandes avec garanties en Excel
   * @param filtres - Filtres à appliquer pour l'export
   * @returns Observable<Blob>
   */
  exportDemandesWithGaranties$ = (filtres) => {
    const params = new URLSearchParams();
    if (filtres) {
      Object.keys(filtres).forEach((key) => {
        const value = filtres[key];
        if (value !== void 0 && value !== null) {
          params.append(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.server}/ecredit/demandes/export?${params.toString()}`, { responseType: "blob" }).pipe(tap(() => console.log("Export des demandes g\xE9n\xE9r\xE9")), catchError(this.handleError));
  };
  /**
   * Obtenir l'historique d'une demande avec garanties
   * @param demandeId - ID de la demande
   * @returns Observable<IResponse>
   */
  getHistoriqueDemandeWithGaranties$ = (demandeId) => this.http.get(`${this.server}/ecredit/demandes/${demandeId}/historique`).pipe(tap((response) => console.log("Historique de la demande:", response)), catchError(this.handleError));
  /**
   * Modifier les garanties d'une demande existante
   * @param demandeId - ID de la demande
   * @param garanties - Nouvelles garanties
   * @returns Observable<IResponse>
   */
  updateGarantiesDemande$ = (demandeId, garanties) => this.http.put(`${this.server}/ecredit/demandes/${demandeId}/garanties`, { garanties }).pipe(tap((response) => console.log("Garanties mises \xE0 jour:", response)), catchError(this.handleError));
  /**
   * Calculer la capacité d'emprunt basée sur les garanties
   * @param garanties - Liste des garanties
   * @returns Observable<IResponse>
   */
  calculerCapaciteEmprunt$ = (garanties) => this.http.post(`${this.server}/ecredit/demandes/calculer-capacite`, { garanties }).pipe(tap((response) => console.log("Capacit\xE9 d'emprunt calcul\xE9e:", response)), catchError(this.handleError));
  /**
   * @deprecated Utiliser addDemandeIndWithGaranties$ à la place
   * Ancienne méthode conservée pour compatibilité
   */
  addDemandeInd$ = (demandeIndividuel) => {
    console.warn("addDemandeInd$ est d\xE9pr\xE9ci\xE9. Utilisez addDemandeIndWithGaranties$ \xE0 la place.");
    return this.addDemandeIndWithGaranties$(demandeIndividuel);
  };
  /**
   * Récupérer toutes les demandes avec garanties selon les critères
   * @param agenceId - ID de l'agence (optionnel)
   * @param pointVenteId - ID du point de vente (optionnel)
   * @returns Observable<IResponse> contenant la liste des demandes avec leurs garanties
   */
  getAllDemandesWithGaranties$ = (agenceId, pointVenteId) => {
    let url = `${this.server}/ecredit/all-with-garanties`;
    const params = [];
    if (agenceId) {
      params.push(`agenceId=${agenceId}`);
    }
    if (pointVenteId) {
      params.push(`pointVenteId=${pointVenteId}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }
    return this.http.get(url).pipe(tap((response) => {
      console.log("Toutes les demandes avec garanties r\xE9cup\xE9r\xE9es:", response);
      if (response.data && response.data.demandeAttentes) {
        console.log(`Nombre total de demandes: ${response.data.count}`);
      }
    }), catchError(this.handleError));
  };
  /**
   * Créer un nouvel avis
   */
  createAvis$(avis) {
    return this.http.post(`${this.server}/ecredit/avis`, avis).pipe(catchError(this.handleError));
  }
  /**
   * Récupérer tous les avis d'une demande
   */
  getAvisByDemande$(demandeId) {
    return this.http.get(`${this.server}/ecredit/avis/demande/${demandeId}`).pipe(catchError(this.handleError));
  }
  /**
   * Mettre à jour un avis
   */
  updateAvis$(avisId, avis) {
    return this.http.put(`${this.server}/ecredit/avis/${avisId}`, avis).pipe(catchError(this.handleError));
  }
  /**
   * Supprimer un avis
   */
  deleteAvis$(avisId) {
    return this.http.delete(`${this.server}/ecredit/avis/${avisId}`).pipe(catchError(this.handleError));
  }
  /**
   * Effectuer le rapprochement de caisse
   */
  checkReconciliation$(dateDebut, dateFin) {
    const params = {
      dateDebut,
      dateFin
    };
    return this.http.get(`${this.server}/ecredit/rapprochement/check`, { params }).pipe(catchError(this.handleError));
  }
  // Méthode pour rejeter une demande (spécifique au DA)
  rejectDemandeIndividuel$ = (demandeIndividuelId) => this.http.patch(`${this.server}/ecredit/update/${demandeIndividuelId}`, {}, { withCredentials: true }).pipe(tap(console.log), catchError(this.handleError));
  // Add these methods to your existing UserService
  // Correction annomalie
  getFicheSignaletique$ = (codCliente) => this.http.get(`${this.server}/ecredit/fiche-signaletique/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));
  addPersonnePhysique$ = (personnePhysique) => this.http.post(`${this.server}/ecredit/addPersonnePhysique`, personnePhysique).pipe(tap(console.log), catchError(this.handleError));
  getListPPAttente$ = () => this.http.get(`${this.server}/ecredit/listPPAttente`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupère la personne physique depuis PostgreSQL (Correction APRES)
   */
  getPersonnePhysique$ = (codCliente) => this.http.get(`${this.server}/ecredit/personnePhysique/${codCliente}`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Rejeter une correction avec motif
   */
  rejetCorrection$ = (motifCorrection) => this.http.post(`${this.server}/ecredit/rejetCorrection`, motifCorrection).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Ajouter un motif de correction
   */
  addMotifCorrection$ = (motifCorrection) => this.http.post(`${this.server}/ecredit/addMotifCorrection`, motifCorrection).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Update fiche signalétique in SAF SQL Server from PostgreSQL data
   */
  updateFicheSignaletique$ = (updateData) => this.http.put(`${this.server}/ecredit/update/fiche-signaletique`, updateData).pipe(tap(console.log), catchError(this.handleError));
  // Mettre à jour la personne physique
  updatePersonnePhysique$(personnePhysique) {
    return this.http.put(`${this.server}/ecredit/updatePersonnePhysique`, personnePhysique).pipe(tap(console.log), catchError(this.handleError));
  }
  /**
   * Récupère la fiche signalétique d'un client avec les soldes
   * @param codCliente Code du client
   * @returns Observable<IResponse> contenant la fiche signalétique avec soldes
   */
  getFicheSignaletiqueWithSolde$ = (codCliente) => this.http.get(`${this.server}/ecredit/fiche-signaletique-with-solde/${codCliente}`).pipe(tap((response) => {
    console.log("Fiche signal\xE9tique avec soldes r\xE9cup\xE9r\xE9e:", response);
    if (response.data?.metadata) {
      console.log("M\xE9tadonn\xE9es:", response.data.metadata);
    }
  }), catchError(this.handleError));
  /**
   * Récupérer la liste des agents de crédit par agence
   */
  getListAgentCredit$ = (agenceId) => this.http.get(`${this.server}/user/list/agent-credit/${agenceId}`).pipe(tap((response) => console.log("Liste agents cr\xE9dit:", response)), catchError(this.handleError));
  /**
   * Activer la rotation pour un agent
   */
  activateRotation$ = (rotationRequest) => this.http.post(`${this.server}/user/rotation/activate`, rotationRequest).pipe(tap((response) => console.log("Rotation activ\xE9e:", response)), catchError(this.handleError));
  /**
   * Désactiver la rotation pour un agent
   */
  deactivateRotation$ = (userId) => this.http.post(`${this.server}/user/rotation/deactivate/${userId}`, {}).pipe(tap((response) => console.log("Rotation d\xE9sactiv\xE9e:", response)), catchError(this.handleError));
  /**
   * Vérifier la disponibilité d'un agent sur un point de vente
   */
  checkAgentDisponibility$ = (userId, pointVenteId) => this.http.get(`${this.server}/user/disponibility/${userId}/${pointVenteId}`).pipe(tap((response) => console.log("Disponibilit\xE9 agent:", response)), catchError(this.handleError));
  handleError = (httpErrorResponse) => {
    console.log(httpErrorResponse);
    let error = "An error occurred. Please try again.";
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
  getListPPRejet$ = () => this.http.get(`${this.server}/ecredit/listRejet`).pipe(tap(console.log), catchError(this.handleError));
  // ==================== SERVICES POUR LA SUGGESTION DE QUANTITÉ (DE) ====================
  /**
   * Suggérer une modification de quantité pour un bon validé par le DR
   * @param idCmd ID du bon de commande
   * @param suggestionDto DTO contenant la quantité suggérée et le motif
   */
  suggererQuantite$(idCmd, suggestionDto) {
    return this.http.put(`${this.server}/ecredit/stock/${idCmd}/suggestion-quantite`, suggestionDto).pipe(tap((response) => console.log("Suggestion de quantit\xE9:", response)), catchError(this.handleError));
  }
  getCorrectionStatsByDelegation$ = () => this.http.get(`${this.server}/ecredit/corrections/stats/delegations`).pipe(tap(console.log), catchError(this.handleError));
  getCorrectionStatsByDelegationWithPeriod$ = (dateDebut, dateFin) => this.http.get(`${this.server}/ecredit/corrections/stats/delegations/period?dateDebut=${dateDebut}&dateFin=${dateFin}`).pipe(tap(console.log), catchError(this.handleError));
  getCorrectionStatsByAgence$ = (delegationId) => this.http.get(`${this.server}/ecredit/corrections/stats/delegations/${delegationId}/by-agency`).pipe(tap(console.log), catchError(this.handleError));
  getCorrectionStatsByPointVente$ = (agenceId) => this.http.get(`${this.server}/ecredit/corrections/stats/by-agency/${agenceId}/by-point`).pipe(tap(console.log), catchError(this.handleError));
  getCorrectionsByPointVente$ = (codeAgence, statut) => {
    const url = `${this.server}/ecredit/corrections/pointvente/${codeAgence}/personnes${statut ? `?statut=${statut}` : ""}`;
    return this.http.get(url).pipe(tap(console.log), catchError(this.handleError));
  };
  getCorrectionEvolutionByDay$ = () => this.http.get(`${this.server}/ecredit/corrections/evolution/by-day`).pipe(tap(console.log), catchError(this.handleError));
  getCorrectionEvolutionByWeek$ = () => this.http.get(`${this.server}/ecredit/corrections/evolution/by-week`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Garder la quantité actuelle sans modification
   * @param idCmd ID du bon de commande
   * @param observations Observations optionnelles
   */
  garderQuantite$(idCmd, observations) {
    const body = observations ? { observations } : {};
    return this.http.put(`${this.server}/ecredit/stock/${idCmd}/garder-quantite`, body).pipe(tap((response) => console.log("Quantit\xE9 conserv\xE9e:", response)), catchError(this.handleError));
  }
  /**
   * Récupérer les bons validés par le DR pour une délégation (pour le DE)
   * @param delegationId ID de la délégation
   */
  getStockValidesPourDE$(delegationId) {
    return this.http.get(`${this.server}/ecredit/stock/valides-pour-de/${delegationId}`).pipe(tap((response) => console.log("Bons valid\xE9s pour DE:", response)), catchError(this.handleError));
  }
  /**
   * Récupérer tous les bons validés par le DR (toutes délégations)
   */
  getAllStockValidesPourDE$() {
    return this.http.get(`${this.server}/ecredit/stock/tous-valides-pour-de`).pipe(tap((response) => console.log("Tous les bons valid\xE9s pour DE:", response)), catchError(this.handleError));
  }
  /**
   * Validation finale par le DE
   * Passe le state_validation de 'VALIDE' à 'ACCEPTE'
   */
  validationFinaleDE$(idCmd, observations) {
    const body = observations ? { observations } : {};
    return this.http.put(`${this.server}/ecredit/stock/${idCmd}/validation-finale-de`, body).pipe(tap((response) => console.log("Validation finale DE:", response)), catchError(this.handleError));
  }
  /**
   * Récupérer tous les bons acceptés par le DE pour la logistique
   */
  getStockAcceptesPourLogistique$() {
    return this.http.get(`${this.server}/ecredit/stock/acceptes-logistique`).pipe(tap((response) => console.log("Bons accept\xE9s pour logistique:", response)), catchError(this.handleError));
  }
  /**
   * Récupérer les bons acceptés par délégation pour la logistique
   */
  getStockAcceptesParDelegation$(delegationId) {
    return this.http.get(`${this.server}/ecredit/stock/acceptes-logistique/${delegationId}`).pipe(tap((response) => console.log("Bons accept\xE9s par d\xE9l\xE9gation:", response)), catchError(this.handleError));
  }
  /**
   * Validation finale par la logistique
   * Change le status de 'ENCOURS' à 'ACCEPT'
   * Le bon disparaît de la vue logistique
   */
  validationLogistique$(idCmd, observations) {
    const body = observations ? { observations } : {};
    return this.http.put(`${this.server}/ecredit/stock/${idCmd}/validation-logistique`, body).pipe(tap((response) => console.log("Validation logistique:", response)), catchError(this.handleError));
  }
  /**
   * Récupérer la synthèse des bons de commande par délégation
   */
  getSyntheseDelegations$ = () => this.http.get(`${this.server}/ecredit/synthese-delegations`).pipe(tap((response) => console.log("Synth\xE8se d\xE9l\xE9gations:", response)), catchError(this.handleError));
  /**
   * Récupérer les bons de commande d'une délégation spécifique
   */
  getBonsCommandeParDelegation$ = (delegation) => this.http.get(`${this.server}/ecredit/bons-commande-delegation?delegation=${encodeURIComponent(delegation)}`).pipe(tap((response) => console.log("Bons commande d\xE9l\xE9gation:", response)), catchError(this.handleError));
  // ==================== BACKOFFICE ETATS DOCUMENTS ====================
  /**
   * Récupérer toutes les délégations
   */
  getAllDelegationsBackoffice$ = () => this.http.get(`${this.server}/ecredit/backoffice/delegations`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer tous les états de documents (toutes délégations)
   */
  getAllEtatsDocuments$ = (page = 0, size = 20) => this.http.get(`${this.server}/ecredit/backoffice/etats?page=${page}&size=${size}`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer les états par délégation
   */
  getEtatsByDelegation$ = (delegationId, page = 0, size = 20, statut) => {
    let url = `${this.server}/ecredit/backoffice/delegations/${delegationId}/etats?page=${page}&size=${size}`;
    if (statut) {
      url += `&statut=${statut}`;
    }
    return this.http.get(url).pipe(tap(console.log), catchError(this.handleError));
  };
  /**
   * Récupérer le détail d'un état
   */
  getEtatDocumentDetail$ = (etatId) => this.http.get(`${this.server}/ecredit/backoffice/etats/${etatId}/detail`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Valider un état (ENCOURS -> VALIDE)
   */
  validerEtatDocument$ = (etatId) => this.http.put(`${this.server}/ecredit/backoffice/etats/${etatId}/valider`, {}).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Accepter un état (VALIDE -> ACCEPTE)
   */
  accepterEtatDocument$ = (etatId) => this.http.put(`${this.server}/ecredit/backoffice/etats/${etatId}/accepter`, {}).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Rejeter un état
   */
  rejeterEtatDocument$ = (etatId, motif) => this.http.put(`${this.server}/ecredit/backoffice/etats/${etatId}/rejeter`, { motif }).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer les statistiques par délégation
   */
  getStatsEtatsDocuments$ = () => this.http.get(`${this.server}/ecredit/backoffice/stats`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer la liste des crédits groupés par délégation
   * @returns Observable<IResponse> contenant la liste des crédits par délégation
   */
  getListCreditParDelegation$ = () => this.http.get(`${this.server}/ecredit/listCreditParDelegation`).pipe(tap((response) => {
    console.log("Liste cr\xE9dits par d\xE9l\xE9gation:", response);
    if (response.data?.listCreditParDelegation) {
      console.log(`Nombre de d\xE9l\xE9gations: ${response.data.listCreditParDelegation.length}`);
    }
  }), catchError(this.handleError));
  /**
   *  Functionnaly for logout
   */
  logOut() {
    localStorage.removeItem(Key.TOKEN);
    localStorage.removeItem(Key.REFRESH_TOKEN);
  }
  isTokenExpired = () => {
    const token = this.storage.get(Key.TOKEN);
    if (!token || token === "" || token === "null" || token === "undefined") {
      return true;
    }
    try {
      const result = this.jwt.isTokenExpired(token);
      if (result instanceof Promise) {
        console.warn("isTokenExpired returned a Promise, treating as expired.");
        return true;
      }
      return result;
    } catch (error) {
      console.error("Erreur lors de la v\xE9rification d'expiration du token:", error);
      return true;
    }
  };
  isAuthenticated = () => {
    const token = this.storage.get(Key.TOKEN);
    if (!token || token === "" || token === "null" || token === "undefined") {
      return false;
    }
    try {
      return !this.jwt.isTokenExpired(token);
    } catch (error) {
      console.error("Erreur lors de la v\xE9rification d'authentification:", error);
      return false;
    }
  };
  // ========================================
  // AUTORISATION UTILISATEUR
  // ========================================
  /**
   * Mettre à jour l'autorisation d'un utilisateur
   */
  updateUserAuthorization$ = (userId, isAuthorized) => this.http.put(`${this.server}/user/authorization/${userId}?isAuthorized=${isAuthorized}`, {}).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer le statut d'autorisation d'un utilisateur
   */
  getUserAuthorizationStatus$ = (userId) => this.http.get(`${this.server}/user/authorization/${userId}/status`).pipe(tap(console.log), catchError(this.handleError));
  /**
   * Récupérer tous les utilisateurs par rôle
   */
  getUsersByRole$ = (roleName) => this.http.get(`${this.server}/user/by-role/${roleName}`).pipe(tap(console.log), catchError(this.handleError));
  // ==================== INFO PERSONNEL ====================
  /**
   * Importer le fichier du personnel (Excel)
   * Format attendu: Matricule | Nom | Prénom
   */
  importInfoPersonnel(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.server}/ecredit/salaire/import/info-personnel`, formData).pipe(catchError(this.handleError));
  }
  /**
   * Récupérer les personnels avec filtre optionnel par statut
   */
  getAllInfoPersonnel(statut) {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    let params = new HttpParams().set("_t", timestamp.toString());
    if (statut) {
      params = params.set("statut", statut);
    }
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel`, { params });
  }
  /**
   * Récupérer uniquement les personnels actifs
   */
  getActiveInfoPersonnel() {
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel/active`);
  }
  /**
   * Mettre à jour le statut d'un personnel
   */
  updateInfoPersonnelStatut(id, statut) {
    const params = new HttpParams().set("statut", statut);
    return this.http.put(`${this.server}/ecredit/salaire/info-personnel/${id}/statut`, null, { params });
  }
  /**
   * Activer un personnel
   */
  activateInfoPersonnel(id) {
    return this.http.put(`${this.server}/ecredit/salaire/info-personnel/${id}/activate`, {});
  }
  /**
   * Désactiver un personnel
   */
  deactivateInfoPersonnel(id) {
    return this.http.put(`${this.server}/ecredit/salaire/info-personnel/${id}/deactivate`, {});
  }
  /**
   * Récupérer un personnel par matricule
   */
  getInfoPersonnelByMatricule(matricule) {
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel/matricule/${matricule}`);
  }
  /**
   * Récupérer un personnel par ID
   */
  getInfoPersonnelById(id) {
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel/${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Compter le nombre de personnels
   */
  countInfoPersonnel() {
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel/count`).pipe(catchError(this.handleError));
  }
  /**
   * Mettre à jour le numéro de compte d'un personnel
   */
  updateNumeroCompte(matricule, numeroCompte) {
    return this.http.put(`${this.server}/ecredit/info-personnel/${matricule}/numero-compte`, null, { params: { numeroCompte } });
  }
  /**
   * Vérifier si le numéro de compte est défini pour un matricule
   */
  checkNumeroCompte(matricule) {
    return this.http.get(`${this.server}/ecredit/salaire/info-personnel/${matricule}/check-numero-compte`).pipe(catchError(this.handleError));
  }
  // ==================== AVANCE SALAIRE ====================
  /**
   * Importer le fichier des avances salaire (Excel)
   * Format attendu: Matricule | NET A PAYER
   */
  importAvanceSalaire(file) {
    const formData = new FormData();
    formData.append("file", file);
    return this.http.post(`${this.server}/ecredit/salaire/import/avance-salaire`, formData);
  }
  /**
   * Récupérer toutes les avances salaire
   */
  getAllAvanceSalaire() {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return this.http.get(`${this.server}/ecredit/salaire/avance-salaire?_t=${timestamp}`);
  }
  /**
   * Récupérer MON avance salaire (utilise le matricule du compte)
   */
  getMyAvanceSalaire() {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return this.http.get(`${this.server}/ecredit/salaire/avance-salaire/me?_t=${timestamp}`);
  }
  /**
   * Récupérer les avances par utilisateur
   */
  getAvanceSalaireByUser(userId) {
    return this.http.get(`${this.server}/ecredit/salaire/avance-salaire/user/${userId}`).pipe(catchError(this.handleError));
  }
  /**
   * Récupérer une avance par ID
   */
  getAvanceSalaireById(id) {
    return this.http.get(`${this.server}/ecredit/salaire/avance-salaire/${id}`).pipe(catchError(this.handleError));
  }
  getAvanceSalaireByMatricule(matricule) {
    return this.getAllAvanceSalaire().pipe(map((response) => {
      if (response.data?.avances) {
        const avances = response.data.avances;
        const avance = avances.find((a) => a.matricule === matricule);
        if (avance) {
          const newResponse = __spreadProps(__spreadValues({}, response), {
            data: __spreadProps(__spreadValues({}, response.data), {
              avance
            })
          });
          return newResponse;
        }
      }
      throw { status: 404, message: "Aucune avance trouv\xE9e pour ce matricule" };
    }));
  }
  /**
   * Récupérer avances par statut
   */
  getAvanceSalaireByStatut(statut) {
    return this.http.get(`${this.server}/ecredit/salaire/avance-salaire/statut/${statut}`).pipe(catchError(this.handleError));
  }
  /**
   * Mettre à jour le statut d'une avance
   */
  updateAvanceSalaireStatut(id, statut) {
    return this.http.put(`${this.server}/ecredit/salaire/avance-salaire/${id}/statut?statut=${statut}`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Supprimer toutes les avances d'un utilisateur
   */
  deleteAvanceSalaireByUser(userId) {
    return this.http.delete(`${this.server}/ecredit/salaire/avance-salaire/user/${userId}`).pipe(catchError(this.handleError));
  }
  /**
   * Vider la table avance_salaire (reset mensuel)
   */
  truncateAvanceSalaire() {
    return this.http.delete(`${this.server}/ecredit/salaire/avance-salaire/truncate`).pipe(catchError(this.handleError));
  }
  // ==================== DEMANDE SALARY ====================
  /**
   * Créer une demande d'avance sur salaire
   */
  createDemandeSalary(matricule, amount, numeroCompte) {
    let params = new HttpParams().set("matricule", matricule).set("amount", amount.toString());
    if (numeroCompte) {
      params = params.set("numeroCompte", numeroCompte);
    }
    return this.http.post(`${this.server}/ecredit/salaire/demande-salary`, null, { params });
  }
  /**
   * Récupérer toutes les demandes de salaire
   */
  getAllDemandeSalary() {
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary`).pipe(catchError(this.handleError));
  }
  /**
   * Récupérer les demandes de salaire de l'utilisateur connecté
   */
  getMyDemandeSalary() {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary/me?_t=${timestamp}`);
  }
  /**
   * Récupérer une demande par ID
   */
  getDemandeSalaryById(id) {
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary/${id}`).pipe(catchError(this.handleError));
  }
  /**
   * Récupérer demandes par statut
   */
  getDemandeSalaryByStatut(statut) {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary/statut/${statut}?_t=${timestamp}`);
  }
  /**
   * Annuler une demande de salaire
   */
  annulerDemandeSalary(id) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/${id}/annuler`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Rejeter une demande de salaire
   */
  rejeterDemandeSalary(id) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/${id}/rejeter`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Valider une demande de salaire
   */
  validerDemandeSalary(id) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/${id}/valider`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Confirmer une demande de salaire
   */
  confirmerDemandeSalary(id) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/${id}/confirmer`, {}).pipe(catchError(this.handleError));
  }
  /**
   * Créer MA demande d'avance (utilise le matricule du compte)
   */
  createMyDemandeSalary(amount, numeroCompte) {
    let params = new HttpParams().set("amount", amount.toString());
    if (numeroCompte) {
      params = params.set("numeroCompte", numeroCompte);
    }
    return this.http.post(`${this.server}/ecredit/salaire/demande-salary/me`, null, { params });
  }
  /**
   * Valider plusieurs demandes en une seule opération
   */
  validerMultipleDemandeSalary(ids) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/valider-multiple`, ids);
  }
  /**
   * Récupérer les demandes groupées par date
   */
  getDemandesGroupedByDate(statut) {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    const params = new HttpParams().set("statut", statut).set("_t", timestamp.toString());
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary/grouped-by-date`, { params });
  }
  /**
   * Confirmer plusieurs demandes en une seule opération (DF)
   */
  confirmerMultipleDemandeSalary(ids) {
    return this.http.put(`${this.server}/ecredit/salaire/demande-salary/confirmer-multiple`, ids);
  }
  /**
   * Exporter les demandes en Excel
   */
  exportDemandesExcel(ids) {
    return this.http.post(`${this.server}/ecredit/salaire/demande-salary/export-excel`, ids || [], {
      responseType: "blob"
    });
  }
  /**
   * Exporter toutes les demandes confirmées en Excel
   */
  exportAllConfirmedDemandesExcel() {
    return this.http.get(`${this.server}/ecredit/salaire/demande-salary/export-excel/confirmer`, {
      responseType: "blob"
    });
  }
  // ==================== AUTHORIZE SALAIRE ====================
  /**
   * Récupérer l'état d'autorisation des demandes
   */
  getAuthorizeSalaire() {
    const timestamp = (/* @__PURE__ */ new Date()).getTime();
    return this.http.get(`${this.server}/ecredit/salaire/authorize?_t=${timestamp}`);
  }
  /**
   * Mettre à jour l'autorisation
   */
  updateAuthorizeSalaire(isAuthorized, message) {
    let params = new HttpParams().set("isAuthorized", isAuthorized.toString());
    if (message) {
      params = params.set("message", message);
    }
    return this.http.put(`${this.server}/ecredit/salaire/authorize`, null, { params });
  }
  /**
   * Activer les demandes
   */
  enableAuthorizeSalaire() {
    return this.http.put(`${this.server}/ecredit/salaire/authorize/enable`, {});
  }
  /**
   * Désactiver les demandes
   */
  disableAuthorizeSalaire() {
    return this.http.put(`${this.server}/ecredit/salaire/authorize/disable`, {});
  }
  /**
   * Récupérer tous les arrêtés pour le suivi
   */
  getAllArretesForSuivi$() {
    return this.http.get(`${this.server}/ecredit/arrete-caisse/suivi`);
  }
  /**
   * Récupérer le dernier arrêté de chaque point de vente
   */
  getLatestArretesByPointvente$() {
    return this.http.get(`${this.server}/ecredit/arrete-caisse/suivi/latest`);
  }
  /**
   * Helper: Parser une date (String ISO ou Array Java)
   */
  parseDate(date) {
    if (!date)
      return null;
    if (Array.isArray(date)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = date;
      return new Date(year, month - 1, day, hour, minute, second);
    }
    return new Date(date);
  }
  /**
   * Helper: Formater une date pour affichage
   */
  formatDate(date) {
    const parsed = this.parseDate(date);
    if (!parsed)
      return "-";
    const day = parsed.getDate().toString().padStart(2, "0");
    const month = (parsed.getMonth() + 1).toString().padStart(2, "0");
    const year = parsed.getFullYear();
    return `${day}/${month}/${year}`;
  }
  /**
   * Helper: Formater datetime pour affichage
   */
  formatDateTime(date) {
    const parsed = this.parseDate(date);
    if (!parsed)
      return "-";
    const day = parsed.getDate().toString().padStart(2, "0");
    const month = (parsed.getMonth() + 1).toString().padStart(2, "0");
    const year = parsed.getFullYear();
    const hour = parsed.getHours().toString().padStart(2, "0");
    const minute = parsed.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hour}:${minute}`;
  }
  /**
   * Helper: Formater montant
   */
  formatMontant(montant) {
    return new Intl.NumberFormat("fr-FR").format(montant) + " GNF";
  }
  static \u0275fac = function UserService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _UserService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _UserService, factory: _UserService.\u0275fac });
};

export {
  Key,
  StorageService,
  UserService
};
//# sourceMappingURL=chunk-SQ5BRWVW.js.map
