package io.digiservices.ecreditservice.reclamation.repository;

import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.CategorieVue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationRecue;
import io.digiservices.ecreditservice.reclamation.dto.ReclamationDtos.ReclamationVue;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;

/** Les réclamations du terrain en base, et rien d'autre (V211). */
@Repository
@RequiredArgsConstructor
public class ReclamationRepository {

    private final JdbcClient jdbcClient;

    /** La requête de lecture, partagée : une seule définition des colonnes rendues. */
    private static final String LECTURE = """
            SELECT r.id, r.identifiant_client, r.categorie, c.libelle AS categorie_libelle,
                   r.objet, r.message, r.cod_agencia, r.num_credito, r.cod_cliente,
                   TRIM(COALESCE(a.first_name,'') || ' ' || COALESCE(a.last_name,'')) AS auteur,
                   pv.libele AS auteur_point_vente,
                   r.saisie_at, r.recue_at, r.statut,
                   TRIM(COALESCE(p.first_name,'') || ' ' || COALESCE(p.last_name,'')) AS prise_par,
                   r.prise_en_charge_at, r.reponse,
                   TRIM(COALESCE(q.first_name,'') || ' ' || COALESCE(q.last_name,'')) AS repondu_par,
                   r.repondu_at, r.notifiee_at,
                   (SELECT COUNT(*) FROM reclamation_piece pi WHERE pi.reclamation_id = r.id) AS nb_pieces
              FROM reclamation r
              JOIN reclamation_categorie c ON c.code = r.categorie
              JOIN users a ON a.user_id = r.auteur_user_id
              LEFT JOIN pointvente pv ON pv.id = a.pointvente_id
              LEFT JOIN users p ON p.user_id = r.prise_en_charge_user_id
              LEFT JOIN users q ON q.user_id = r.repondu_par_user_id
            """;

    // ------------------------------------------------------------------ les catégories

    public List<CategorieVue> categories() {
        return jdbcClient.sql("""
                        SELECT code, libelle, ordre FROM reclamation_categorie
                         WHERE actif ORDER BY ordre, libelle
                        """)
                .query((rs, n) -> new CategorieVue(rs.getString("code"), rs.getString("libelle"),
                        rs.getInt("ordre")))
                .list();
    }

    /** Le responsable d'une catégorie, exprimé comme la matrice : département ou rôle. */
    public Optional<Responsable> responsable(String categorie) {
        return jdbcClient.sql("""
                        SELECT resp_service, resp_departement, resp_role, libelle
                          FROM reclamation_categorie WHERE code = :code AND actif
                        """)
                .param("code", categorie)
                .query((rs, n) -> new Responsable(rs.getString("resp_service"),
                        rs.getString("resp_departement"), rs.getString("resp_role"),
                        rs.getString("libelle")))
                .optional();
    }

    /** Qui répond d'une catégorie : un département de la matrice, ou un rôle dans un service. */
    public record Responsable(String service, String departement, String role, String libelle) {

        public boolean parRole() {
            return role != null && !role.isBlank();
        }
    }

    // ----------------------------------------------------------------- l'écriture

    public Optional<Long> idReclamation(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM reclamation WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    public Long enregistrer(ReclamationRecue r, Long auteurUserId, Long appareilId, Long lotId) {
        return jdbcClient.sql("""
                        INSERT INTO reclamation (identifiant_client, categorie, objet, message,
                               cod_agencia, num_credito, cod_cliente, auteur_user_id, appareil_id,
                               sync_lot_id, saisie_at)
                        VALUES (:identifiant, :categorie, :objet, :message,
                               :cod, :num, :client, :auteur, :appareil, :lot, :saisie)
                        RETURNING id
                        """)
                .param("identifiant", r.identifiantClient()).param("categorie", r.categorie())
                .param("objet", r.objet()).param("message", r.message())
                .param("cod", r.codAgencia()).param("num", r.numCredito())
                .param("client", r.codCliente()).param("auteur", auteurUserId)
                .param("appareil", appareilId).param("lot", lotId)
                .param("saisie", r.saisieAt())
                .query(Long.class).single();
    }

    /** Date l'acheminement : une réclamation sans cette date n'a prévenu personne. */
    public void marquerNotifiee(Long id, int nbDestinataires) {
        jdbcClient.sql("""
                        UPDATE reclamation
                           SET notifiee_at = CURRENT_TIMESTAMP, nb_destinataires = :nb
                         WHERE id = :id
                        """)
                .param("id", id).param("nb", nbDestinataires).update();
    }

    public int prendreEnCharge(Long id, Long userId) {
        return jdbcClient.sql("""
                        UPDATE reclamation
                           SET statut = 'EN_COURS', prise_en_charge_user_id = :user,
                               prise_en_charge_at = CURRENT_TIMESTAMP
                         WHERE id = :id AND statut = 'OUVERTE'
                        """)
                .param("id", id).param("user", userId).update();
    }

    public int repondre(Long id, Long userId, String reponse) {
        return jdbcClient.sql("""
                        UPDATE reclamation
                           SET statut = 'TRAITEE', reponse = :reponse,
                               repondu_par_user_id = :user, repondu_at = CURRENT_TIMESTAMP,
                               prise_en_charge_user_id = COALESCE(prise_en_charge_user_id, :user),
                               prise_en_charge_at = COALESCE(prise_en_charge_at, CURRENT_TIMESTAMP)
                         WHERE id = :id AND statut <> 'TRAITEE'
                        """)
                .param("id", id).param("user", userId).param("reponse", reponse).update();
    }

    // ------------------------------------------------------------------- la lecture

    /** Les réclamations d'un agent, les plus récentes en tête. */
    public List<ReclamationVue> deLAuteur(Long auteurUserId, int limite) {
        return jdbcClient.sql(LECTURE + """
                         WHERE r.auteur_user_id = :auteur
                         ORDER BY r.saisie_at DESC
                         LIMIT :limite
                        """)
                .param("auteur", auteurUserId).param("limite", limite)
                .query(ReclamationRepository::versVue).list();
    }

    public Optional<ReclamationVue> parId(Long id) {
        return jdbcClient.sql(LECTURE + " WHERE r.id = :id")
                .param("id", id).query(ReclamationRepository::versVue).optional();
    }

    /**
     * La file des directions. Le statut et la catégorie filtrent quand ils sont donnés ; sans
     * eux, tout remonte — six directions partagent la rubrique, chacune doit pouvoir voir
     * l'ensemble plutôt que de croire qu'une réclamation s'est perdue.
     */
    public List<ReclamationVue> file(String statut, String categorie, int limite) {
        return jdbcClient.sql(LECTURE + """
                         WHERE (CAST(:statut AS VARCHAR) IS NULL OR r.statut = CAST(:statut AS VARCHAR))
                           AND (CAST(:categorie AS VARCHAR) IS NULL OR r.categorie = CAST(:categorie AS VARCHAR))
                         ORDER BY CASE r.statut WHEN 'OUVERTE' THEN 0 WHEN 'EN_COURS' THEN 1 ELSE 2 END,
                                  r.recue_at DESC
                         LIMIT :limite
                        """)
                .param("statut", statut).param("categorie", categorie).param("limite", limite)
                .query(ReclamationRepository::versVue).list();
    }

    /** Les compteurs de la file, en une requête : ce que l'écran annonce en tête. */
    public java.util.Map<String, Object> compteurs() {
        return jdbcClient.sql("""
                        SELECT COUNT(*) FILTER (WHERE statut = 'OUVERTE')  AS ouvertes,
                               COUNT(*) FILTER (WHERE statut = 'EN_COURS') AS en_cours,
                               COUNT(*) FILTER (WHERE statut = 'TRAITEE')  AS traitees
                          FROM reclamation
                        """)
                .query().singleRow();
    }

    // -------------------------------------------------------------------- les pièces

    public Optional<Long> idPiece(String identifiantClient) {
        if (identifiantClient == null || identifiantClient.isBlank()) {
            return Optional.empty();
        }
        return jdbcClient.sql("SELECT id FROM reclamation_piece WHERE identifiant_client = :id")
                .param("id", identifiantClient).query(Long.class).optional();
    }

    public Optional<Long> enregistrerPiece(String identifiantClient, Long reclamationId,
                                           String fichier, long taille, OffsetDateTime priseAt) {
        return jdbcClient.sql("""
                        INSERT INTO reclamation_piece (identifiant_client, reclamation_id, fichier,
                                                       taille_octets, prise_at)
                        VALUES (:identifiant, :reclamation, :fichier, :taille, :prise)
                        ON CONFLICT (identifiant_client) DO NOTHING
                        RETURNING id
                        """)
                .param("identifiant", identifiantClient).param("reclamation", reclamationId)
                .param("fichier", fichier).param("taille", taille).param("prise", priseAt)
                .query(Long.class).optional();
    }

    /** L'auteur d'une réclamation : sert à refuser la pièce de quelqu'un d'autre. */
    public Optional<Long> auteurDe(Long reclamationId) {
        return jdbcClient.sql("SELECT auteur_user_id FROM reclamation WHERE id = :id")
                .param("id", reclamationId).query(Long.class).optional();
    }

    // -------------------------------------------------------------------- le commun

    private static ReclamationVue versVue(java.sql.ResultSet rs, int n) throws java.sql.SQLException {
        return new ReclamationVue(
                rs.getLong("id"), rs.getString("identifiant_client"), rs.getString("categorie"),
                rs.getString("categorie_libelle"), rs.getString("objet"), rs.getString("message"),
                rs.getString("cod_agencia"),
                rs.getObject("num_credito") == null ? null : rs.getLong("num_credito"),
                rs.getString("cod_cliente"), rs.getString("auteur"), rs.getString("auteur_point_vente"),
                rs.getObject("saisie_at", OffsetDateTime.class),
                rs.getObject("recue_at", OffsetDateTime.class),
                rs.getString("statut"), rs.getString("prise_par"),
                rs.getObject("prise_en_charge_at", OffsetDateTime.class),
                rs.getString("reponse"), rs.getString("repondu_par"),
                rs.getObject("repondu_at", OffsetDateTime.class),
                rs.getObject("notifiee_at") != null,
                rs.getInt("nb_pieces"));
    }
}
