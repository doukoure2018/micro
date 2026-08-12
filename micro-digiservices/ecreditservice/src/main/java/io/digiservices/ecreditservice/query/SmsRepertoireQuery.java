package io.digiservices.ecreditservice.query;

public class SmsRepertoireQuery {

    public static final String SELECT_REPERTOIRES = """
            SELECT r.repertoire_id AS "repertoireId",
                   r.produit, r.segment, r.libelle,
                   r.nb_numeros AS "nbNumeros",
                   r.charge_par AS "chargePar",
                   r.date_chargement AS "dateChargement"
            FROM sms_repertoire r
            ORDER BY r.produit, r.segment DESC
            """;

    public static final String SELECT_REPERTOIRE_BY_ID = """
            SELECT r.repertoire_id AS "repertoireId",
                   r.produit, r.segment, r.libelle,
                   r.nb_numeros AS "nbNumeros",
                   r.charge_par AS "chargePar",
                   r.date_chargement AS "dateChargement"
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

    public static final String COPIER_REPERTOIRE_VERS_CAMPAGNE = """
            INSERT INTO sms_campagne_destinataire (campagne_id, telephone)
            SELECT :campagneId, n.telephone
            FROM sms_repertoire_numero n
            WHERE n.repertoire_id = :repertoireId
            ON CONFLICT (campagne_id, telephone) DO NOTHING
            """;

    public static final String UPDATE_CAMPAGNE_SOURCE = """
            UPDATE sms_campagne
            SET source_repertoire_id = :repertoireId
            WHERE campagne_id = :campagneId
            """;
}
