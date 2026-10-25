package io.digiservices.ecreditservice.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Lectures du poste de supervision (lot 3). Rien n'est calcule ici qui ne soit deja ecrit
 * ailleurs : le journal des traitements, le journal des envois, les compteurs d'anomalies et
 * l'etat du circuit du credit. L'ecran se contente de les rassembler.
 */
@Repository
@RequiredArgsConstructor
public class SupervisionRepository {

    // Chaine bordee d'espaces : un bloc de texte perd l'espace de fin de ligne, et
    // « WHERE """ + EN_COURS » a deja donne WHERECOALESCE(… le 23/10/2026.
    private static final String EN_COURS =
            " COALESCE(d.statut_demande, '') NOT IN ('REJET', 'REJECTED', 'ANNULE')"
            + " AND COALESCE(d.validation_state, '') <> 'VALIDATED_FINAL' ";

    private final JdbcClient jdbcClient;

    /** Le dernier passage d'un traitement sur une journee. */
    public record Passage(String job, String statut, OffsetDateTime quand, Long dureeMs,
                          String message, int executions, int echecs) {
    }

    /**
     * Envois d'un type sur une journee. {@code doublons} compte les courriels partis deux fois
     * vers la meme adresse avec le meme objet : c'est la seule mesure fiable d'un envoi rejoue.
     * Comparer le nombre d'envois au nombre de destinataires ne suffit pas, un meme traitement
     * pouvant legitimement ecrire plusieurs fois dans la journee.
     */
    public record Envois(String type, int envois, int destinataires, int doublons, int sujets,
                         OffsetDateTime premier, OffsetDateTime dernier) {
    }

    /**
     * Dernier passage de chaque traitement du jour, avec le nombre d'executions et d'echecs.
     * Un traitement absent de cette liste n'a pas tourne : c'est tout l'interet de l'ecran,
     * car le journal ne montrait jusqu'ici que ce qui avait tourne.
     */
    public List<Passage> passagesDuJour(LocalDate jour) {
        return jdbcClient.sql("""
                SELECT a.job,
                       (ARRAY_AGG(a.statut ORDER BY a.id DESC))[1] AS statut,
                       MAX(a.date_execution) AS quand,
                       (ARRAY_AGG(a.duree_ms ORDER BY a.id DESC))[1] AS duree_ms,
                       (ARRAY_AGG(a.message ORDER BY a.id DESC))[1] AS message,
                       count(*) AS executions,
                       count(*) FILTER (WHERE a.statut = 'ECHEC') AS echecs
                FROM alerte_execution a
                WHERE a.date_execution::date = :jour
                GROUP BY a.job
                ORDER BY a.job
                """)
                .param("jour", jour)
                .query((rs, n) -> new Passage(rs.getString("job"), rs.getString("statut"),
                        rs.getObject("quand", OffsetDateTime.class), (Long) rs.getObject("duree_ms"),
                        rs.getString("message"), rs.getInt("executions"), rs.getInt("echecs")))
                .list();
    }

    /**
     * Envois du jour par type. L'ecart entre le nombre d'envois et le nombre de destinataires
     * distincts est le signe d'un envoi rejoue : le 24/10/2026, cinq cent vingt-sept courriels
     * sont partis vers cent quatre-vingt-neuf adresses sans que rien ne le signale.
     */
    public List<Envois> envoisDuJour(LocalDate jour) {
        return jdbcClient.sql("""
                SELECT e.type, count(*) AS envois,
                       count(DISTINCT e.destinataire) AS destinataires,
                       count(DISTINCT COALESCE(e.sujet, '')) AS sujets,
                       count(*) - count(DISTINCT (COALESCE(e.sujet, ''), COALESCE(e.destinataire, '')))
                           AS doublons,
                       MIN(e.date_envoi) AS premier, MAX(e.date_envoi) AS dernier
                FROM alerte_envoi e
                WHERE e.date_envoi::date = :jour
                GROUP BY e.type
                ORDER BY e.type
                """)
                .param("jour", jour)
                .query((rs, n) -> new Envois(rs.getString("type"), rs.getInt("envois"),
                        rs.getInt("destinataires"), rs.getInt("doublons"), rs.getInt("sujets"),
                        rs.getObject("premier", OffsetDateTime.class),
                        rs.getObject("dernier", OffsetDateTime.class)))
                .list();
    }

    /** Anomalies ouvertes, tous services confondus. */
    public int creditsNegatifsOuverts() {
        return compte("SELECT count(*) FROM credit_negatif WHERE corrige_at IS NULL");
    }

    public int creditsNegatifsDuJour(LocalDate jour) {
        return jdbcClient.sql("""
                SELECT count(*) FROM credit_negatif WHERE detecte_at::date = :jour
                """)
                .param("jour", jour)
                .query(Integer.class).single();
    }

    public int contactsEnEchec() {
        return compte("SELECT count(*) FROM users WHERE COALESCE(email_en_echec, FALSE)");
    }

    public int correctionsEnAttente() {
        return compte("SELECT count(*) FROM personne_physique WHERE correction_statut = 'EN_ATTENTE'");
    }

    /**
     * Dossiers en cours portes par un agent desactive : le dossier avance encore sur le papier
     * mais plus personne ne le tient.
     */
    public int dossiersSansTitulaire() {
        return compte("""
                SELECT count(*) FROM demandeindividuel d
                LEFT JOIN users ua ON ua.user_id = d.agent_credit_affecte
                WHERE""" + EN_COURS + """
                  AND d.agent_credit_affecte IS NOT NULL
                  AND NOT COALESCE(ua.enabled, TRUE)
                """);
    }

    /** L'etat du circuit du credit, lu sur la colonne d'etat du dossier. */
    public record FluxCredit(int enCours, int enCorrection, int enAttenteDa, int annulationsDemandees,
                             int validesAujourdhui, int creesAujourdhui) {
    }

    /**
     * {@code demandeindividuel} ne porte pas de date de derniere modification : les validations
     * du jour se comptent donc dans l'historique des etats, seul endroit ou la date figure.
     */
    public FluxCredit fluxCredit(LocalDate jour) {
        return jdbcClient.sql("""
                SELECT
                  count(*) FILTER (WHERE""" + EN_COURS + """
                     ) AS en_cours,
                  count(*) FILTER (WHERE COALESCE(d.validation_state, '') IN
                     ('CORRECTION', 'CORRECTION_ACCUEIL', 'CORRECTION_DA', 'CORRECTION_DR', 'CORRECTION_DE',
                      'RETOUR_AGENT')) AS en_correction,
                  count(*) FILTER (WHERE COALESCE(d.validation_state, '') = 'EN_ATTENTE_DA') AS en_attente_da,
                  count(*) FILTER (WHERE COALESCE(d.validation_state, '') = 'ANNULATION_DEMANDEE')
                     AS annulations_demandees,
                  (SELECT count(DISTINCT h.demandeindividuel_id) FROM demande_etat_historique h
                   WHERE h.nouvel_etat = 'VALIDATED_FINAL' AND h.date_evenement::date = :jour)
                     AS valides_aujourdhui,
                  count(*) FILTER (WHERE d.createdat::date = :jour) AS crees_aujourdhui
                FROM demandeindividuel d
                """)
                .param("jour", jour)
                .query((rs, n) -> new FluxCredit(rs.getInt("en_cours"), rs.getInt("en_correction"),
                        rs.getInt("en_attente_da"), rs.getInt("annulations_demandees"),
                        rs.getInt("valides_aujourdhui"), rs.getInt("crees_aujourdhui")))
                .single();
    }

    /** Connexions du jour, pour dire d'un coup d'oeil si la plateforme est utilisee. */
    public int connexionsDuJour(LocalDate jour) {
        return jdbcClient.sql("""
                SELECT count(*) FROM users WHERE last_login::date = :jour
                """)
                .param("jour", jour)
                .query(Integer.class).single();
    }

    private int compte(String sql) {
        Integer n = jdbcClient.sql(sql).query(Integer.class).single();
        return n == null ? 0 : n;
    }

    /** Derniere execution connue d'un traitement, toutes dates confondues. */
    public Optional<Passage> dernierPassage(String job) {
        return jdbcClient.sql("""
                SELECT job, statut, date_execution AS quand, duree_ms, message
                FROM alerte_execution WHERE job = :job ORDER BY id DESC LIMIT 1
                """)
                .param("job", job)
                .query((rs, n) -> new Passage(rs.getString("job"), rs.getString("statut"),
                        rs.getObject("quand", OffsetDateTime.class), (Long) rs.getObject("duree_ms"),
                        rs.getString("message"), 1, "ECHEC".equals(rs.getString("statut")) ? 1 : 0))
                .optional();
    }
}
