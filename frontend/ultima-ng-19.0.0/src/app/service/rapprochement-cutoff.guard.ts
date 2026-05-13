import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { RapprochementCutoffService } from './rapprochement-cutoff.service';

/**
 * Bloque l'acces aux pages de rapprochement caisse apres l'heure de coupure (10:00 Conakry).
 * Affiche un toast et redirige vers le dashboard.
 */
export const RapprochementCutoffGuard: CanActivateFn = () => {
    const router = inject(Router);
    const cutoffService = inject(RapprochementCutoffService);
    const messageService = inject(MessageService, { optional: true });

    if (cutoffService.isPageAccessible()) {
        return true;
    }

    const message = `Service ferme depuis ${cutoffService.getCutoffTimeLabel()}. Reouverture demain a 00:00.`;

    if (messageService) {
        messageService.add({
            severity: 'warn',
            summary: 'Acces refuse',
            detail: message,
            life: 6000
        });
    } else {
        // eslint-disable-next-line no-alert
        alert(message);
    }

    router.navigate(['/dashboards']);
    return false;
};
