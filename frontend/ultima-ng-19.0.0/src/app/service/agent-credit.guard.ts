import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';

/**
 * Accès réservé au rôle AGENT_CREDIT (création d'une demande de crédit).
 * - Non authentifié / token expiré -> page de login.
 * - Authentifié mais autre rôle -> page "accès refusé".
 */
export const AgentCreditGuard: CanActivateFn = () => {
    const router = inject(Router);
    const userService = inject(UserService);

    if (!userService.isAuthenticated() || userService.isTokenExpired()) {
        router.navigate(['/auth/login']);
        return false;
    }
    if (userService.hasRole('AGENT_CREDIT')) {
        return true;
    }
    router.navigate(['/auth/access']);
    return false;
};
