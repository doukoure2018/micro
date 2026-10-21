package io.digiservices.ebanking.config;

import java.util.concurrent.Executor;

/**
 * Cible SAF de la requete en cours (V-aiguillage, 2026-10-21). Portee par un ThreadLocal pose
 * par {@link io.digiservices.ebanking.security.SafRoutageFilter} ; les taches planifiees, qui
 * n'ont pas de requete, lisent la sauvegarde par defaut.
 */
public final class SafRoutage {

    public enum Cible { PRODUCTION, SAUVEGARDE }

    private static final ThreadLocal<Cible> COURANTE = new ThreadLocal<>();

    private SafRoutage() {
    }

    public static void forcer(Cible cible) {
        COURANTE.set(cible);
    }

    public static void effacer() {
        COURANTE.remove();
    }

    /** null = pas de decision explicite (le routeur applique sa valeur par defaut). */
    public static Cible courante() {
        return COURANTE.get();
    }

    /**
     * Executeur qui transmet la cible du fil appelant au fil de travail : sans cela, une lecture
     * de fiche signaletique deleguee a un pool de threads partirait vers la sauvegarde alors que
     * la requete est marquee production.
     */
    public static Executor propager(Executor delegue) {
        return tache -> {
            Cible cible = COURANTE.get();
            delegue.execute(() -> {
                Cible avant = COURANTE.get();
                if (cible == null) COURANTE.remove(); else COURANTE.set(cible);
                try {
                    tache.run();
                } finally {
                    if (avant == null) COURANTE.remove(); else COURANTE.set(avant);
                }
            });
        };
    }
}
