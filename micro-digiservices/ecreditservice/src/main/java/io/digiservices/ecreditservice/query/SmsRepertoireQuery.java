package io.digiservices.ecreditservice.query;

public class SmsRepertoireQuery {

    public static final String SELECT_REPERTOIRES = """
            SELECT r.repertoire_id AS "repertoireId",
                   r.produit, r.segment, r.libelle,
                   r.nb_numeros AS "nbNumeros",
                   r.charge_par AS "chargePar",
                   r.date_chargement AS "dateChargement",
                   (SELECT COUNT(*) FROM sms_repertoire_numero n
                     JOIN sms_optout o ON o.telephone = n.telephone AND o.actif
                    WHERE n.repertoire_id = r.repertoire_id) AS "nbExclus"
            FROM sms_repertoire r
            ORDER BY r.produit, r.segment DESC
            """;

    public static final String SELECT_REPERTOIRE_BY_ID = """
            SELECT r.repertoire_id AS "repertoireId",
                   r.produit, r.segment, r.libelle,
                   r.nb_numeros AS "nbNumeros",
                   r.charge_par AS "chargePar",
                   r.date_chargement AS "dateChargement",
                   (SELECT COUNT(*) FROM sms_repertoire_numero n
                     JOIN sms_optout o ON o.telephone = n.telephone AND o.actif
                    WHERE n.repertoire_id = r.repertoire_id) AS "nbExclus"
            FROM sms_repertoire r
            WHERE r.repertoire_id = :repertoireId
            """;

    /** Vider le répertoire (rechargement : DELETE puis INSERT dans la même transaction). */
    public static final String DELETE_NUMEROS = """
            DELETE FROM sms_repertoire_numero WHERE repertoire_id = :repertoireId
            """;

    public static final String INSERT_NUMERO = """
            INSERT INTO sms_repertoire_numero (repertoire_id, telephone)
            VALUES (:repertoireId, :telephone)
            ON CONFLICT (repertoire_id, telephone) DO NOTHING
            """;

    public static final String UPDATE_REPERTOIRE_APRES_CHARGEMENT = """
            UPDATE sms_repertoire
            SET nb_numeros = (SELECT COUNT(*) FROM sms_repertoire_numero WHERE repertoire_id = :repertoireId),
                charge_par = :chargePar,
                date_chargement = CURRENT_TIMESTAMP
            WHERE repertoire_id = :repertoireId
            """;

    public static final String INSERT_JOURNAL_CHARGEMENT = """
            INSERT INTO sms_repertoire_chargement (repertoire_id, nb_importes, nb_doublons, nb_invalides, charge_par)
            VALUES (:repertoireId, :nbImportes, :nbDoublons, :nbInvalides, :chargePar)
            """;

    /**
     * Insertion en UN SEUL ordre : l'ancienne version envoyait une requete par numero, soit dix
     * mille allers-retours pour une campagne, dans une transaction qui tenait le verrou du
     * repertoire — deja vide — pendant tout ce temps.
     */
    public static final String INSERT_NUMEROS_EN_LOT = """
            INSERT INTO sms_repertoire_numero (repertoire_id, telephone)
            SELECT :repertoireId, t
            FROM unnest(string_to_array(:telephones, ',')) AS t
            ON CONFLICT (repertoire_id, telephone) DO NOTHING
            """;

    /** Historique des chargements : la table etait ecrite depuis aout et n'etait jamais lue. */
    public static final String SELECT_CHARGEMENTS = """
            SELECT nb_importes    AS "nbImportes",
                   nb_doublons    AS "nbDoublons",
                   nb_invalides   AS "nbInvalides",
                   charge_par     AS "chargePar",
                   date_chargement AS "dateChargement"
            FROM sms_repertoire_chargement
            WHERE repertoire_id = :repertoireId
            ORDER BY date_chargement DESC
            LIMIT :limite
            """;

    /** Un numero precis, ou un fragment : « ce numero est-il dans ce repertoire ? ». */
    public static final String SELECT_NUMEROS_RECHERCHE = """
            SELECT n.telephone
            FROM sms_repertoire_numero n
            WHERE n.repertoire_id = :repertoireId
              AND n.telephone LIKE :motif
            ORDER BY n.telephone
            LIMIT :size OFFSET :offset
            """;

    public static final String COUNT_NUMEROS = """
            SELECT COUNT(*)
            FROM sms_repertoire_numero n
            WHERE n.repertoire_id = :repertoireId
              AND (:motif = '%' OR n.telephone LIKE :motif)
            """;

    public static final String SELECT_NUMEROS = """
            SELECT n.telephone
            FROM sms_repertoire_numero n
            WHERE n.repertoire_id = :repertoireId
            ORDER BY n.telephone
            LIMIT :size OFFSET :offset
            """;

    // ══════ Snapshot répertoire -> campagne (source exclusive des campagnes) ══════

    /** La campagne repart de zéro : ses destinataires sont remplacés par le répertoire choisi. */
    public static final String DELETE_DESTINATAIRES_CAMPAGNE = """
            DELETE FROM sms_campagne_destinataire WHERE campagne_id = :campagneId
            """;

    /**
     * PREMIER des deux filtres de desinscription : un numero exclu n'entre jamais dans une
     * campagne. Le second est applique juste avant l'envoi, pour celui qui se desinscrirait
     * entre la creation de la campagne et son lancement.
     */
    public static final String COPIER_REPERTOIRE_VERS_CAMPAGNE = """
            INSERT INTO sms_campagne_destinataire (campagne_id, telephone)
            SELECT :campagneId, n.telephone
            FROM sms_repertoire_numero n
            WHERE n.repertoire_id = :repertoireId
              AND NOT EXISTS (SELECT 1 FROM sms_optout o
                               WHERE o.telephone = n.telephone AND o.actif)
            ON CONFLICT (campagne_id, telephone) DO NOTHING
            """;

    /** Combien de numeros du repertoire ont ete ecartes par la desinscription. */
    public static final String COUNT_EXCLUS_REPERTOIRE = """
            SELECT COUNT(*)
            FROM sms_repertoire_numero n
            JOIN sms_optout o ON o.telephone = n.telephone AND o.actif
            WHERE n.repertoire_id = :repertoireId
            """;

    public static final String UPDATE_CAMPAGNE_SOURCE = """
            UPDATE sms_campagne
            SET source_repertoire_id = :repertoireId
            WHERE campagne_id = :campagneId
            """;
}
