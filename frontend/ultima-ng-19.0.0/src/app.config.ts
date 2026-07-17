import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';
import Material from '@primeng/themes/material';
import { definePreset } from '@primeng/themes';
import { UserService } from '@/service/user.service';
import { StorageService } from '@/service/storage.service';
import { TokenInterceptor } from '@/interceptors/token.interceptor';
import { CacheInterceptor } from '@/interceptors/cache.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

// Couleur de marque CRG / DIGI-CREDIT : vert foncé du logo (~#15803D).
// Palette primaire ancree sur ce vert (500 = vert du logo), pour tout le thème.
const MyPreset = definePreset(Material, {
    semantic: {
        primary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#34c26a',
            500: '#15803d',
            600: '#136a34',
            700: '#11562b',
            800: '#0e4623',
            900: '#0a381c',
            950: '#052e16'
        }
    }
});

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),
        provideAnimations(),
        // CORRECTION CRITIQUE : Une seule configuration HttpClient avec les intercepteurs
        provideHttpClient(withFetch(), withInterceptors([TokenInterceptor, CacheInterceptor])),
        // SUPPRIMÉ : provideHttpClient(withFetch()), // ← Cette ligne supprimée !

        provideAnimationsAsync(),
        providePrimeNG({
            ripple: true,
            inputStyle: 'filled',
            theme: { preset: MyPreset, options: { darkModeSelector: '.app-dark' } }
        }),

        UserService,
        StorageService
    ]
};
