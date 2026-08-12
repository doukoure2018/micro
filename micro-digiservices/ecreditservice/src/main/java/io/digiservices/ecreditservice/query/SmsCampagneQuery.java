package io.digiservices.ecreditservice.query;

public class SmsCampagneQuery {

    /** Colonnes campagne + compteurs par statut (LEFT JOIN LATERAL évité : agrégation simple). */
    private static final String CAMPAGNE_SELECT = """
            SELECT c.campagne_id AS "campagneId",
                   c.nom,
                   c.message,
                   c.statut,
                   c.total_destinataires AS "totalDestinataires",
                   c.cree_par AS "creePar",
                   c.date_creation AS "dateCreation",
                   c.date_lancement AS "dateLancement",
                   c.date_fin AS "dateFin",
                   c.source_repertoire_id AS "sourceRepertoireId",
                   r.libelle AS "sourceRepertoireLibelle",
                   COALESCE(SUM(CASE WHEN d.statut = 'EN_ATTENTE' THEN 1 ELSE 0 END), 0) AS "nbEnAttente",
                   COALESCE(SUM(CASE WHEN d.statut = 'ENCOURS' THEN 1 ELSE 0 END), 0) AS "nbEncours",
                   COALESCE(SUM(CASE WHEN d.statut = 'SUCCESS' THEN 1 ELSE 0 END), 0) AS "nbSucces",
                   COALESCE(SUM(CASE WHEN d.statut = 'FAILED' THEN 1 ELSE 0 END), 0) AS "nbEchecs"
            FROM sms_campagne c
            LEFT JOIN sms_repertoire r ON r.repertoire_id = c.source_repertoire_id
            LEFT JOIN sms_campagne_destinataire d ON d.campagne_id = c.campagne_id
            """;

    public static final String INSERT_CAMPAGNE = """
            INSERT INTO sms_campagne (nom, message, cree_par)
            VALUES (:nom, :message, :creePar)
            RETURNING campagne_id
            """;

    public static final String SELECT_CAMPAGNES = CAMPAGNE_SELECT + """
            GROUP BY c.campagne_id, r.libelle
            ORDER BY c.date_creation DESC
            """;

    public static final String SELECT_CAMPAGNE_BY_ID = CAMPAGNE_SELECT + """
            WHERE c.campagne_id = :campagneId
            GROUP BY c.campagne_id, r.libelle
            """;

    public static final String INSERT_DESTINATAIRE = """
            INSERT INTO sms_campagne_destinataire (campagne_id, telephone)
            VALUES (:campagneId, :telephone)
            ON CONFLICT (campagne_id, telephone) DO NOTHING
            """;

    public static final String UPDATE_TOTAL_DESTINATAIRES = """
            UPDATE sms_campagne
            SET total_destinataires = (SELECT COUNT(*) FROM sms_campagne_destinataire WHERE campagne_id = :campagneId)
            WHERE campagne_id = :campagneId
            """;

    /** Transitions de cycle de vie : chaque transition est gardée par les états de départ valides. */
    public static final String UPDATE_LANCER = """
            UPDATE sms_campagne
            SET statut = 'EN_COURS', date_lancement = COALESCE(date_lancement, CURRENT_TIMESTAMP)
            WHERE campagne_id = :campagneId AND statut IN ('BROUILLON', 'EN_PAUSE')
            """;

    public static final String UPDATE_PAUSE = """
            UPDATE sms_campagne SET statut = 'EN_PAUSE'
            WHERE campagne_id = :campagneId AND statut = 'EN_COURS'
            """;

    public static final String UPDATE_ANNULER = """
            UPDATE sms_campagne SET statut = 'ANNULEE', date_fin = CURRENT_TIMESTAMP
            WHERE campagne_id = :campagneId AND statut IN ('BROUILLON', 'EN_COURS', 'EN_PAUSE')
            """;

    /** Terminaison automatique quand la file est vide (appelée par le dispatcher). */
    public static final String UPDATE_TERMINER_SI_FINIE = """
            UPDATE sms_campagne SET statut = 'TERMINEE', date_fin = CURRENT_TIMESTAMP
            WHERE campagne_id = :campagneId AND statut = 'EN_COURS'
              AND NOT EXISTS (
                  SELECT 1 FROM sms_campagne_destinataire
                  WHERE campagne_id = :campagneId AND statut IN ('EN_ATTENTE', 'ENCOURS')
              )
            """;

    /** Campagne active la plus ancienne (le dispatcher traite une campagne à la fois). */
    public static final String SELECT_CAMPAGNE_ACTIVE = """
            SELECT c.campagne_id FROM sms_campagne c
            WHERE c.statut = 'EN_COURS'
            ORDER BY c.date_lancement ASC NULLS LAST
            LIMIT 1
            """;

    /**
     * Réservation atomique d'un lot : passe EN_ATTENTE -> ENCOURS et retourne les lignes.
     * SKIP LOCKED protège contre un double traitement si plusieurs instances tournent.
     */
    public static final String CLAIM_BATCH = """
            UPDATE sms_campagne_destinataire
            SET statut = 'ENCOURS'
            WHERE destinataire_id IN (
                SELECT destinataire_id FROM sms_campagne_destinataire
                WHERE campagne_id = :campagneId AND statut = 'EN_ATTENTE'
                ORDER BY destinataire_id
                LIMIT :batchSize
                FOR UPDATE SKIP LOCKED
            )
            RETURNING destinataire_id AS "destinataireId", campagne_id AS "campagneId",
                      telephone, statut, motif_echec AS "motifEchec", tentatives, date_envoi AS "dateEnvoi"
            """;

    public static final String UPDATE_ENVOI_SUCCES = """
            UPDATE sms_campagne_destinataire
            SET statut = 'SUCCESS', date_envoi = CURRENT_TIMESTAMP, motif_echec = NULL
            WHERE destinataire_id = :destinataireId
            """;

    /** Échec : retente (retour EN_ATTENTE) tant que le plafond de tentatives n'est pas atteint. */
    public static final String UPDATE_ENVOI_ECHEC = """
            UPDATE sms_campagne_destinataire
            SET tentatives = tentatives + 1,
                motif_echec = :motif,
                statut = CASE WHEN tentatives + 1 >= :maxTentatives THEN 'FAILED' ELSE 'EN_ATTENTE' END,
                date_envoi = CURRENT_TIMESTAMP
            WHERE destinataire_id = :destinataireId
            """;

    /** Filet de sécurité au démarrage : les ENCOURS orphelins (crash) redeviennent EN_ATTENTE. */
    public static final String RESET_ENCOURS_ORPHELINS = """
            UPDATE sms_campagne_destinataire
            SET statut = 'EN_ATTENTE'
            WHERE statut = 'ENCOURS'
            """;

    public static final String SELECT_DESTINATAIRES = """
            SELECT d.destinataire_id AS "destinataireId",
                   d.campagne_id AS "campagneId",
                   d.telephone, d.statut,
                   d.motif_echec AS "motifEchec",
                   d.tentatives,
                   d.date_envoi AS "dateEnvoi"
            FROM sms_campagne_destinataire d
            WHERE d.campagne_id = :campagneId
              AND (CAST(:statut AS VARCHAR) IS NULL OR d.statut = CAST(:statut AS VARCHAR))
            ORDER BY d.destinataire_id
            LIMIT :size OFFSET :offset
            """;
}
