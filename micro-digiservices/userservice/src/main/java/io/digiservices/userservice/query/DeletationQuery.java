package io.digiservices.userservice.query;

public class DeletationQuery {

    public static final String INSERT_DELEGATION_QUERY =
                    """
                        INSERT INTO delegation(libele) VALUES(:libele)
                    """;

    public static final String GET_ALL_DELEGATION_QUERY = "SELECT * FROM delegation";


    public static final String GET_DELEGATION_BY_ID = "SELECT * FROM delegation WHERE id = :delegationId";
}
