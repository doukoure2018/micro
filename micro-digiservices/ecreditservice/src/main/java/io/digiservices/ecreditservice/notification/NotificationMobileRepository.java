package io.digiservices.ecreditservice.notification;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.digiservices.ecreditservice.notification.NotificationMobile.Journal;
import io.digiservices.ecreditservice.notification.NotificationMobile.Vue;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;

/** Le journal des notifications en base (V215). */
@Repository
@RequiredArgsConstructor
@Slf4j
public class NotificationMobileRepository {

    private final JdbcClient jdbcClient;
    private final ObjectMapper mapper;

    /** Range la notification et rend son identifiant. L'envoi, lui, vient après. */
    public Long ranger(Long userId, String categorie, String titre, String corps,
                       String ecran, Map<String, Object> parametres) {
        return jdbcClient.sql("""
                        INSERT INTO notification_mobile (user_id, categorie, titre, corps, ecran, parametres)
                        VALUES (:user, :cat, :titre, :corps, :ecran, CAST(:params AS JSONB))
                        RETURNING id
                        """)
                .param("user", userId).param("cat", categorie)
                .param("titre", tronquer(titre, 120)).param("corps", tronquer(corps, 300))
                .param("ecran", ecran).param("params", json(parametres))
                .query(Long.class).single();
    }

    /** Date l'envoi. Une notification sans cette date est rangée mais n'a prévenu personne. */
    public void marquerEnvoyee(Long id, int nbAppareils) {
        jdbcClient.sql("""
                        UPDATE notification_mobile
                           SET envoye_at = CURRENT_TIMESTAMP, nb_appareils = :nb
                         WHERE id = :id
                        """)
                .param("id", id).param("nb", nbAppareils).update();
    }

    public Journal journal(Long userId, int limite) {
        List<Vue> vues = jdbcClient.sql("""
                        SELECT id, categorie, titre, corps, ecran, parametres, creee_at,
                               envoye_at IS NOT NULL AS envoyee, lue_at IS NOT NULL AS lue
                          FROM notification_mobile
                         WHERE user_id = :user
                         ORDER BY creee_at DESC
                         LIMIT :limite
                        """)
                .param("user", userId).param("limite", limite)
                .query((rs, n) -> new Vue(rs.getLong("id"), rs.getString("categorie"),
                        rs.getString("titre"), rs.getString("corps"), rs.getString("ecran"),
                        parametres(rs.getString("parametres")),
                        rs.getObject("creee_at", OffsetDateTime.class),
                        rs.getBoolean("envoyee"), rs.getBoolean("lue")))
                .list();
        return new Journal(nonLues(userId), vues);
    }

    public int nonLues(Long userId) {
        Integer n = jdbcClient.sql("""
                        SELECT count(*) FROM notification_mobile
                         WHERE user_id = :user AND lue_at IS NULL
                        """)
                .param("user", userId).query(Integer.class).single();
        return n == null ? 0 : n;
    }

    /**
     * Marque comme lues. Sans identifiants, tout le journal de l'agent : c'est le bouton
     * « Tout marquer lu » de la maquette.
     */
    public int marquerLues(Long userId, List<Long> ids) {
        String sql = """
                UPDATE notification_mobile SET lue_at = CURRENT_TIMESTAMP
                 WHERE user_id = :user AND lue_at IS NULL
                """;
        var spec = jdbcClient.sql(ids == null || ids.isEmpty() ? sql : sql + " AND id IN (:ids)")
                .param("user", userId);
        if (ids != null && !ids.isEmpty()) {
            spec = spec.param("ids", ids);
        }
        return spec.update();
    }

    // ------------------------------------------------------- les promesses à vérifier

    /** Un agent, et le nombre de promesses échues qu'il doit aller vérifier. */
    public record PromessesDues(Long userId, int nombre) {
    }

    /**
     * Les promesses dont la date est passée sans règlement constaté.
     *
     * <p>Cette lecture vit ici parce qu'elle n'existe que pour produire une notification —
     * aucun écran ne l'affiche. Elle ne touche pas SAF : elle croise la dernière visite de
     * chaque crédit avec la dernière mesure connue de ce crédit (V210). Un impayé nul ou
     * <b>inconnu</b> ne compte pas : on ne reproche pas à un membre un défaut qu'on n'a pas
     * observé.</p>
     *
     * <p>La fenêtre existe pour que la liste se vide. Sans elle, une promesse de mars reste
     * comptée pour toujours et l'agent lit « 47 promesses à vérifier » chaque matin — un
     * chiffre qu'on finit par ne plus voir.</p>
     */
    public List<PromessesDues> promessesEchues(int fenetreJours) {
        return jdbcClient.sql("""
                        WITH derniere AS (
                            SELECT DISTINCT ON (v.cod_agencia, v.num_credito)
                                   v.cod_agencia, v.num_credito, v.agent_user_id, v.promesse_date
                              FROM recouvrement_visite v
                             WHERE v.promesse_date IS NOT NULL
                               AND v.hors_portefeuille = FALSE
                             ORDER BY v.cod_agencia, v.num_credito, v.saisie_at DESC, v.id DESC
                        )
                        SELECT d.agent_user_id AS user_id, count(*) AS nombre
                          FROM derniere d
                          JOIN portefeuille_credit_photo p
                            ON p.cod_agencia = d.cod_agencia
                           AND p.num_credito = d.num_credito
                         WHERE d.promesse_date < CURRENT_DATE
                           AND d.promesse_date >= CURRENT_DATE - make_interval(days => :fenetre)
                           AND COALESCE(p.montant_impaye, 0) > 0
                         GROUP BY d.agent_user_id
                        """)
                .param("fenetre", fenetreJours)
                .query((rs, n) -> new PromessesDues(rs.getLong("user_id"), rs.getInt("nombre")))
                .list();
    }

    /**
     * L'agent a-t-il déjà reçu une notification de cette catégorie aujourd'hui ?
     *
     * <p>Le garde-fou d'une tâche rejouable : SafJobRetry la relance quand SAF était muet, et
     * sans cette question l'agent recevrait deux fois la même chose le même matin.</p>
     */
    public boolean dejaRecuAujourdhui(Long userId, String categorie) {
        Integer n = jdbcClient.sql("""
                        SELECT count(*) FROM notification_mobile
                         WHERE user_id = :user AND categorie = :cat
                           AND creee_at >= date_trunc('day', CURRENT_TIMESTAMP)
                        """)
                .param("user", userId).param("cat", categorie)
                .query(Integer.class).single();
        return n != null && n > 0;
    }

    /** Les notifications trop vieilles pour apprendre quoi que ce soit. */
    public int purger(int jours) {
        return jdbcClient.sql("""
                        DELETE FROM notification_mobile
                         WHERE creee_at < CURRENT_TIMESTAMP - make_interval(days => :jours)
                        """)
                .param("jours", jours).update();
    }

    // -------------------------------------------------------------------------- le commun

    private String json(Map<String, Object> parametres) {
        if (parametres == null || parametres.isEmpty()) {
            return null;
        }
        try {
            return mapper.writeValueAsString(parametres);
        } catch (Exception e) {
            log.warn("[NOTIF] parametres illisibles, ignores : {}", e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parametres(String json) {
        if (json == null || json.isBlank()) {
            return Map.of();
        }
        try {
            return mapper.readValue(json, Map.class);
        } catch (Exception e) {
            return Map.of();
        }
    }

    private static String tronquer(String s, int max) {
        if (s == null) {
            return "";
        }
        String propre = s.trim();
        return propre.length() <= max ? propre : propre.substring(0, max - 1) + "…";
    }
}
