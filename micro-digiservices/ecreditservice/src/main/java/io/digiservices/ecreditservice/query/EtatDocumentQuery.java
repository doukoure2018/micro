package io.digiservices.ecreditservice.query;

public class EtatDocumentQuery {

    public static final String SELECT_ETAT_BY_ID = """
            SELECT * FROM etat_document WHERE id = :id
            """;

    public static final String SELECT_ALL_ETATS_BY_DATE = """
            SELECT * FROM etat_document ORDER BY created_at DESC LIMIT :limit OFFSET :offset
            """;

    public static final String SELECT_ETATS_BY_USER_ID = """
            SELECT * FROM etat_document WHERE user_id = :userId ORDER BY created_at DESC LIMIT :limit OFFSET :offset
            """;

    public static final String INSERT_ETAT = """
        INSERT INTO etat_document (statut, user_id, motif, created_at, updated_at)
        VALUES (:statut, :userId, :motif, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """;

    public static final String SELECT_BY_ID = """
        SELECT id, statut, user_id, motif, created_at, updated_at
        FROM etat_document
        WHERE id = :id
        """;

    public static final String SELECT_ALL_BY_DATE = """
        SELECT id, statut, user_id, motif, created_at, updated_at
        FROM etat_document
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    public static final String UPDATE_ETAT_STATUT = """
            UPDATE etat_document SET statut = :statut, updated_at = CURRENT_TIMESTAMP
            WHERE id = :id
            """;

    public static final String COUNT_ALL_ETATS = """
            SELECT COUNT(*) FROM etat_document
            """;

    public static final String COUNT_ETATS_BY_USER = """
            SELECT COUNT(*) FROM etat_document WHERE user_id = :userId
            """;

    public static final String COUNT_BY_USER_ID = """
        SELECT COUNT(*) FROM etat_document WHERE user_id = :userId
        """;
    public static final String UPDATE_STATUT = """
        UPDATE etat_document
        SET statut = :statut, motif = NULL, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;
    public static final String SELECT_BY_USER_ID = """
        SELECT id, statut, user_id, motif, created_at, updated_at
        FROM etat_document
        WHERE user_id = :userId
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """;
    public static final String RESET_TO_ENCOURS = """
        UPDATE etat_document 
        SET statut = 'ENCOURS', motif = NULL, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;


    public static final String EXISTS_BY_ID = """
        SELECT COUNT(*) > 0 FROM etat_document WHERE id = :id
        """;

    public static final String UPDATE_STATUT_WITH_MOTIF = """
        UPDATE etat_document 
        SET statut = :statut, motif = :motif, updated_at = CURRENT_TIMESTAMP 
        WHERE id = :id
        """;

    public static final String EXISTS_ETAT_BY_ID = """
            SELECT COUNT(*) > 0 FROM etat_document WHERE id = :id
            """;
}