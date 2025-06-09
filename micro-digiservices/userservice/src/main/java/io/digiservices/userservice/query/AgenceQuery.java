package io.digiservices.userservice.query;

public class AgenceQuery {

    public static final String INSERT_AGENCE_QUERY = "INSERT INTO agence(libele,delegation_id) VALUES(:libele,:delegationId)";

    public static final String GET_ALL_AGENCE = "SELECT * FROM agence";
    public static final String GET_ALL_AGENCE_DELEGATION_ID_QUERY = "SELECT * FROM agence WHERE delegation_id = :delegationId";
    public static final String GET_ALL_AGENCE_QUERY = "SELECT * FROM agence WHERE id = :agenceId";
}
