package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

/**
 * Journal des alertes (V175) : trace durable de ce que le planificateur publie, pour que le
 * barometre d'usage puisse en rendre compte. Le journal du conteneur, lui, disparait a chaque
 * deploiement — le detail du premier envoi reel du 24/10/2026 a ete perdu de cette facon.
 *
 * <p>Ecrire le journal ne doit jamais empecher une alerte de partir : toute erreur ici est
 * avalee apres une ligne de log.</p>
 */
@Repository
@RequiredArgsConstructor
@Slf4j
public class AlerteJournalRepository {

    private final JdbcClient jdbcClient;

    /** Un message publie. « Publie » et non « recu » : la remise est l'affaire du service de notification. */
    public void envoi(String type, String canal, String destinataire, Long userId, String roleCible,
                      Long delegationId, String sujet, Integer nbLignes) {
        try {
            jdbcClient.sql("""
                    INSERT INTO alerte_envoi (type, canal, destinataire, user_id, role_cible, delegation_id, sujet, nb_lignes)
                    VALUES (:type, :canal, :destinataire, :userId, :roleCible, :delegationId, :sujet, :nbLignes)
                    """)
                    .param("type", type).param("canal", canal)
                    .param("destinataire", tronquer(destinataire, 150)).param("userId", userId)
                    .param("roleCible", roleCible).param("delegationId", delegationId)
                    .param("sujet", tronquer(sujet, 300)).param("nbLignes", nbLignes)
                    .update();
        } catch (Exception e) {
            log.warn("[ALERTE JOURNAL] envoi non journalise ({}) : {}", type, premiereLigne(e));
        }
    }

    /** Un passage du planificateur ; les reprises apres restauration SAF comptent comme des tentatives. */
    public void execution(String job, String statut, int tentative, Integer nbEcheances, Integer nbImpayes,
                          Integer nbAgents, Integer nbDa, Integer nbDr, Integer nbDe, Long dureeMs, String message) {
        try {
            jdbcClient.sql("""
                    INSERT INTO alerte_execution (job, statut, tentative, nb_echeances, nb_impayes,
                                                  nb_agents, nb_da, nb_dr, nb_de, duree_ms, message)
                    VALUES (:job, :statut, :tentative, :nbEcheances, :nbImpayes,
                            :nbAgents, :nbDa, :nbDr, :nbDe, :dureeMs, :message)
                    """)
                    .param("job", job).param("statut", statut).param("tentative", tentative)
                    .param("nbEcheances", nbEcheances).param("nbImpayes", nbImpayes)
                    .param("nbAgents", nbAgents).param("nbDa", nbDa).param("nbDr", nbDr).param("nbDe", nbDe)
                    .param("dureeMs", dureeMs).param("message", tronquer(message, 500))
                    .update();
        } catch (Exception e) {
            log.warn("[ALERTE JOURNAL] execution non journalisee ({}) : {}", job, premiereLigne(e));
        }
    }

    private static String tronquer(String s, int max) {
        if (s == null) return null;
        return s.length() <= max ? s : s.substring(0, max - 1) + "…";
    }

    private static String premiereLigne(Exception e) {
        String m = e.getMessage();
        return m == null ? e.toString() : m.split("\\R")[0];
    }
}
