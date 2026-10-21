package io.digiservices.ecreditservice.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * Execution des taches du matin qui lisent SAF (aiguillage, lot 3). La sauvegarde est
 * restauree vers 07:15 et reste inaccessible quelques minutes ; les taches passent donc apres
 * 08:15 et, si la base est encore en restauration (lecture en echec), la tache est rejouee
 * un peu plus tard, un nombre limite de fois. Les tentatives tournent sur un fil dedie :
 * le planificateur Spring, a un seul fil, n'est jamais bloque.
 */
@Component
@Slf4j
public class SafJobRetry {

    private final ScheduledExecutorService executeur = Executors.newSingleThreadScheduledExecutor(r -> {
        Thread t = new Thread(r, "saf-jobs");
        t.setDaemon(true);
        return t;
    });

    @Value("${saf.jobs.tentatives:4}")
    private int tentatives;
    @Value("${saf.jobs.delai-minutes:15}")
    private int delaiMinutes;

    /** Lance la tache tout de suite sur le fil dedie, et la rejoue apres delaiMinutes si elle echoue. */
    public void executer(String nom, Runnable tache) {
        executeur.execute(() -> tenter(nom, tache, 1));
    }

    private void tenter(String nom, Runnable tache, int numero) {
        try {
            tache.run();
            if (numero > 1) {
                log.info("[SAF-JOBS] « {} » reussie a la tentative {}", nom, numero);
            }
        } catch (Exception e) {
            String cause = e.getMessage() == null ? e.getClass().getSimpleName() : e.getMessage().split("\\R")[0];
            if (numero >= tentatives) {
                log.error("[SAF-JOBS] « {} » abandonnee apres {} tentatives : {}", nom, numero, cause);
                return;
            }
            log.warn("[SAF-JOBS] « {} » en echec (tentative {}/{}) : {} — nouvelle tentative dans {} min",
                    nom, numero, tentatives, cause, delaiMinutes);
            executeur.schedule(() -> tenter(nom, tache, numero + 1), delaiMinutes, TimeUnit.MINUTES);
        }
    }
}
