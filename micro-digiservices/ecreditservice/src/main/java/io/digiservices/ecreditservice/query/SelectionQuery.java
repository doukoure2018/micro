package io.digiservices.ecreditservice.query;

public class SelectionQuery {


    public static final String INSERT_SELECTION_QUERY =
            """ 
            INSERT INTO selection(doc, created_at, user_id, demandeIndividuel_id) VALUES (:doc, NOW(), :userId, :demandeindividuel_id)
            """;

    public static final String  SELECT_ALL_SELECTION_BY_ID_QUERY =
            """ 
                SELECT * FROM selection WHERE demandeIndividuel_id = :demandeindividuel_id
             """;

    public static final String  COUNT_USER_BY_ID_QUERY = "SELECT COUNT(*) FROM users WHERE user_id = :userId";

    public static final String  COUNT_DEMANDE_INDIVIDUEL_BY_ID_QUERY = "SELECT COUNT(*) FROM demandeIndividuel WHERE demandeIndividuel_id = :demandeindividuel_id";

    public static final String DELETE_DOCUMENT_QUERY = "DELETE FROM selection WHERE selection_id = :selection_id";
}
