import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RapprochementCutoffService {
    /** Heure de fermeture pour les nouveaux acces (HH:mm en heure de Conakry) */
    private readonly CUTOFF_TIME = '10:00';
    /** Periode de grace en minutes pour finaliser une session deja ouverte */
    private readonly GRACE_PERIOD_MINUTES = 15;
    /** Fuseau horaire de reference */
    private readonly TIMEZONE = 'Africa/Conakry';

    /**
     * Vrai si la page est encore accessible (avant l'heure de coupure).
     * Utilise par le route guard.
     */
    isPageAccessible(): boolean {
        const { hours, minutes } = this.currentTimeInZone();
        const [cutH, cutM] = this.CUTOFF_TIME.split(':').map(Number);
        return hours < cutH || (hours === cutH && minutes < cutM);
    }

    /**
     * Vrai si une soumission est encore autorisee (avant fin de periode de grace).
     * Utilise par les composants pour activer/desactiver le bouton submit.
     */
    isSubmissionAllowed(): boolean {
        const { hours, minutes } = this.currentTimeInZone();
        const [cutH, cutM] = this.CUTOFF_TIME.split(':').map(Number);
        const cutoffMinutes = cutH * 60 + cutM + this.GRACE_PERIOD_MINUTES;
        const nowMinutes = hours * 60 + minutes;
        return nowMinutes < cutoffMinutes;
    }

    /**
     * Minutes restantes avant la fin de la periode de grace (peut etre negatif).
     */
    minutesUntilSubmissionClosed(): number {
        const { hours, minutes } = this.currentTimeInZone();
        const [cutH, cutM] = this.CUTOFF_TIME.split(':').map(Number);
        const cutoffMinutes = cutH * 60 + cutM + this.GRACE_PERIOD_MINUTES;
        const nowMinutes = hours * 60 + minutes;
        return cutoffMinutes - nowMinutes;
    }

    /**
     * Vrai si on est dans la zone d'avertissement (15 min avant cutoff).
     */
    isInWarningZone(): boolean {
        const { hours, minutes } = this.currentTimeInZone();
        const [cutH, cutM] = this.CUTOFF_TIME.split(':').map(Number);
        const cutoffMinutes = cutH * 60 + cutM;
        const nowMinutes = hours * 60 + minutes;
        return nowMinutes >= cutoffMinutes - 15 && nowMinutes < cutoffMinutes;
    }

    getCutoffTimeLabel(): string {
        return this.CUTOFF_TIME;
    }

    getGracePeriodEndLabel(): string {
        const [cutH, cutM] = this.CUTOFF_TIME.split(':').map(Number);
        const total = cutH * 60 + cutM + this.GRACE_PERIOD_MINUTES;
        const h = Math.floor(total / 60);
        const m = total % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
    }

    private currentTimeInZone(): { hours: number; minutes: number } {
        const formatter = new Intl.DateTimeFormat('fr-FR', {
            timeZone: this.TIMEZONE,
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
        const parts = formatter.formatToParts(new Date());
        const hours = Number(parts.find(p => p.type === 'hour')?.value ?? '0');
        const minutes = Number(parts.find(p => p.type === 'minute')?.value ?? '0');
        return { hours, minutes };
    }
}
