package io.digiservices.ecreditservice.query;

public class DocumentCartePrepaidQuery {

    public static final String SELECT_DOCUMENT_BY_ID = """
            SELECT d.*, e.statut as etat_statut, e.user_id as etat_user_id, 
                   e.created_at as etat_created_at, e.updated_at as etat_updated_at
            FROM document_carte_prepaid d
            LEFT JOIN etat_document e ON d.id_etat_doc = e.id
            WHERE d.id = :id
            """;

    public static final String SELECT_ALL_DOCUMENTS = """
            SELECT d.*, e.statut as etat_statut, e.user_id as etat_user_id,
                   e.created_at as etat_created_at, e.updated_at as etat_updated_at
            FROM document_carte_prepaid d
            LEFT JOIN etat_document e ON d.id_etat_doc = e.id
            ORDER BY d.created_at DESC
            LIMIT :limit OFFSET :offset
            """;

    public static final String SELECT_DOCUMENTS_BY_USER_ID = """
            SELECT d.*, e.statut as etat_statut, e.user_id as etat_user_id,
                   e.created_at as etat_created_at, e.updated_at as etat_updated_at
            FROM document_carte_prepaid d
            LEFT JOIN etat_document e ON d.id_etat_doc = e.id
            WHERE d.user_id = :userId
            ORDER BY d.created_at DESC
            LIMIT :limit OFFSET :offset
            """;

    public static final String SELECT_DOCUMENTS_BY_ETAT_ID = """
            SELECT d.*, e.statut as etat_statut, e.user_id as etat_user_id,
                   e.created_at as etat_created_at, e.updated_at as etat_updated_at
            FROM document_carte_prepaid d
            LEFT JOIN etat_document e ON d.id_etat_doc = e.id
            WHERE d.id_etat_doc = :idEtatDoc
            ORDER BY d.created_at DESC
            LIMIT :limit OFFSET :offset
            """;

    public static final String INSERT_DOCUMENT = """
        INSERT INTO document_carte_prepaid (id_etat_doc, doc, user_id, created_at, updated_at)
        VALUES (:idEtatDoc, :doc, :userId, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        """;

    public static final String SELECT_BY_ID = """
        SELECT id, id_etat_doc, doc, user_id, created_at, updated_at
        FROM document_carte_prepaid
        WHERE id = :id
        """;

    public static final String SELECT_BY_ETAT_ID = """
        SELECT id, id_etat_doc, doc, user_id, created_at, updated_at
        FROM document_carte_prepaid
        WHERE id_etat_doc = :idEtatDoc
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    public static final String COUNT_BY_ETAT_ID = """
        SELECT COUNT(*) FROM document_carte_prepaid WHERE id_etat_doc = :idEtatDoc
        """;
    public static final String DELETE_DOCUMENT = """
            DELETE FROM document_carte_prepaid WHERE id = :id
            """;

    public static final String COUNT_ALL_DOCUMENTS = """
            SELECT COUNT(*) FROM document_carte_prepaid
            """;

    public static final String COUNT_DOCUMENTS_BY_USER = """
            SELECT COUNT(*) FROM document_carte_prepaid WHERE user_id = :userId
            """;

    public static final String COUNT_DOCUMENTS_BY_ETAT = """
            SELECT COUNT(*) FROM document_carte_prepaid WHERE id_etat_doc = :idEtatDoc
            """;

    public static final String EXISTS_DOCUMENT_BY_ID = """
            SELECT COUNT(*) > 0 FROM document_carte_prepaid WHERE id = :id
            """;

    public static final String SELECT_BY_USER_ID = """
        SELECT id, id_etat_doc, doc, user_id, created_at, updated_at
        FROM document_carte_prepaid
        WHERE user_id = :userId
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    public static final String COUNT_BY_USER_ID = """
        SELECT COUNT(*) FROM document_carte_prepaid WHERE user_id = :userId
        """;

    public static final String SELECT_ALL = """
        SELECT id, id_etat_doc, doc, user_id, created_at, updated_at
        FROM document_carte_prepaid
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
        """;

    public static final String COUNT_ALL = """
        SELECT COUNT(*) FROM document_carte_prepaid
        """;

    public static final String DELETE_BY_ID = """
        DELETE FROM document_carte_prepaid WHERE id = :id
        """;

    public static final String EXISTS_BY_ID = """
        SELECT COUNT(*) > 0 FROM document_carte_prepaid WHERE id = :id
        """;
}