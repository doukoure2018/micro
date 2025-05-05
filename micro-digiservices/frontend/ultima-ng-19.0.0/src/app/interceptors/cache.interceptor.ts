import { HttpCacheService } from '@/service/http.cache.service';
import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

export const CacheInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const httpCache = inject(HttpCacheService);

    // Bypass caching for specific URLs and non-GET methods
    if (shouldBypassCache(request, httpCache)) {
        return next(request);
    }

    // Check for a cached response
    const cachedResponse = httpCache.get(request.url);
    if (cachedResponse) {
        console.log(`Cache hit for URL: ${request.url}`);
        httpCache.logCache();
        return of(cachedResponse);
    }

    // No cache hit, handle the request and cache the response
    return handleAndCacheResponse(request, next, httpCache);
};

/**
 * Determines whether the cache should be bypassed based on the request.
 * @param request The HttpRequest object.
 * @returns True if the cache should be bypassed, false otherwise.
 */
function shouldBypassCache(request: HttpRequest<unknown>, httpCache: HttpCacheService): boolean {
    const bypassUrls = ['verify', 'login', 'refresh', 'resetpassword'];
    const isBypassUrl = bypassUrls.some((url) => request.url.includes(url));

    // Bypass cache for certain URLs or non-GET methods or download endpoints
    if (isBypassUrl || request.method !== 'GET' || request.url.includes('download')) {
        // Optionally evict all cache for non-GET requests
        httpCache.evictAll();
        return true;
    }

    return false;
}

/**
 * Handles the request and caches the response if applicable.
 * @param request The HttpRequest object.
 * @param next The HttpHandlerFn for forwarding the request.
 * @returns An Observable of HttpEvent.
 */
function handleAndCacheResponse(request: HttpRequest<any>, next: HttpHandlerFn, httpCache: HttpCacheService): Observable<HttpEvent<any>> {
    return next(request).pipe(
        tap((event) => {
            if (event instanceof HttpResponse && request.method === 'GET') {
                console.log(`Caching response for URL: ${request.url}`);
                httpCache.put(request.url, event);
            }
        })
    );
}
