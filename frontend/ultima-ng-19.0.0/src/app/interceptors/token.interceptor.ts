import { Key } from '@/enum/cache.key';
import { StorageService } from '@/service/storage.service';
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

export const TokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const storage = inject(StorageService);
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    // Skip authorization for certain URLs
    if (shouldSkipAuthorization(request)) {
        return next(request);
    }

    // Get token from storage service
    const token = storage.get(Key.TOKEN);

    // Add token to request ONLY if token exists and is valid
    const authRequest = addAuthorizationTokenHeader(request, token);

    return next(authRequest).pipe(
        catchError((error: HttpErrorResponse) => {
            // If unauthorized, redirect to login
            if (error.status === 401) {
                handleAuthFailure(storage, router);
            }
            return throwError(() => error);
        })
    );
};

// Helper functions
function shouldSkipAuthorization(request: HttpRequest<unknown>): boolean {
    const skipUrls = ['verify', 'login', 'refresh', 'resetpassword', 'oauth2/token', 'search', 'typeCredit', 'agences', 'pointventes', 'addDemandeInd', 'newDemandeInd'];
    return skipUrls.some((url) => request.url.includes(url));
}

function handleAuthFailure(storage: StorageService, router: Router): void {
    // Clear tokens and redirect to login
    storage.remove(Key.TOKEN);
    storage.remove(Key.REFRESH_TOKEN);
    router.navigate(['/']); // Redirection vers la page d'accueil
}

function addAuthorizationTokenHeader(request: HttpRequest<unknown>, token: any): HttpRequest<unknown> {
    // CORRECTION : Vérifier si le token existe ET n'est pas vide
    if (!token || token === '' || token === 'null' || token === 'undefined') {
        return request; // Retourner la requête sans modification
    }

    return request.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
    });
}
