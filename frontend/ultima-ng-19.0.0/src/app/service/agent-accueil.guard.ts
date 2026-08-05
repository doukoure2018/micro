import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

/**
 * Accès à l'environnement de réception des demandes (accueil).
 * Autorisé au rôle AGENT_ACCUEIL, ainsi qu'aux AGENT_CREDIT (le backend
 * vérifie que la fonction ACCUEIL leur a été activée par le DA).
 */
export const AgentAccueilGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);

    if (!userService.isAuthenticated() || userService.isTokenExpired()) {
        router.navigate(['/auth/login']);
        return false;
    }
    if (userService.hasRole('AGENT_ACCUEIL') || userService.hasRole('AGENT_CREDIT')) {
        return true;
    }
    router.navigate(['/auth/access']);
    return false;
};
