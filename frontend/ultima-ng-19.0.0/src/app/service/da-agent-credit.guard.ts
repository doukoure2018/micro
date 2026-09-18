import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

/**
 * Accès réservé aux rôles DA et AGENT_CREDIT (page « Dossiers clôturés », V148).
 * - Non authentifié / token expiré -> page de login.
 * - Authentifié mais autre rôle -> page "accès refusé".
 * Le backend reste la vraie barrière (périmètre agence / point de service de l'utilisateur).
 */
export const DaAgentCreditGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);

    if (!userService.isAuthenticated() || userService.isTokenExpired()) {
        router.navigate(['/auth/login']);
        return false;
    }
    if (userService.hasRole('DA') || userService.hasRole('AGENT_CREDIT')) {
        return true;
    }
    router.navigate(['/auth/access']);
    return false;
};
