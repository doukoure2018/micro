package io.digiservices.ecreditservice.query;

public class PromoteurQuery {

    public static final String CREATE_PROMOTEUR_QUERY =
            "INSERT INTO promoteur (nom, prenom, date_naissance, numero_identite, adresse, telephone, email, date_creation, date_modification) " +
                    "VALUES (:nom, :prenom, :dateNaissance, :numeroIdentite, :adresse, :telephone, :email, NOW(), NOW())";

    public static final String SELECT_PROMOTEUR_BY_ID_QUERY =
                  """
                    SELECT * FROM promoteur WHERE promoteur_id = :promoteurId
                  """;
    public static final String SELECT_CONTACT_PROMOTEUR_QUERY =
                  """
                    SELECT * FROM promoteur WHERE telephone = :contact
                  """;
}
