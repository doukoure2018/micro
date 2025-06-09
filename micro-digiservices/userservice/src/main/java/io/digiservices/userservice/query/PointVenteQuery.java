package io.digiservices.userservice.query;

public class PointVenteQuery {

    public static final String INSERT_POINT_VENTE_QUERY = "INSERT INTO pointvente(libele,code,delegation_id,agence_id) VALUES(:libele,:code,:delegationId,:agenceId)";

    public static final String GET_ALL_POINT_VENTE = "SELECT * FROM pointvente";
    public static final String GET_ALL_POINT_VENTE_DELEGATION_ID_QUERY = "SELECT * FROM pointvente WHERE delegation_id = :delegationId";
    public static final String GET_ALL_POINT_VENTE_AGENCE_ID_QUERY = "SELECT * FROM pointvente WHERE agence_id = :agenceId";
    public static final String GET_ALL_POINT_VENTE_QUERY = "SELECT * FROM pointvente WHERE id = :pointVenteId";
}