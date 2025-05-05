package io.digiservices.ecreditservice.query;

public class DemandeIndQuery {

    public static final String INSERT_NEW_DEMANDE_IND_QUERY =
            """
            INSERT INTO demandeIndividuel (
                nom, prenom,telephone,age, numero_membre,delegation,
                agence,
                pos,
                quartier,
                fonction,
                createdAt,
                montant,
                activite,
                statut_demande,
                commune_residence,
                validation_state,
                type_apport,
                statut_selection,
                current_activite,
                raison,
                object,
                tip_credito,
                cod_usuarios
            ) VALUES (
                :nom,
                :prenom,
                :telephone,
                :age,
                :numero_membre,
                :delegation,
                :agence,
                :pos,
                :quartier,
                :fonction,
                :createdAt,
                :montant,
                :activite,
                :statut_demande,
                :commune_residence,
                :validation_state,
                :type_apport,
                :statut_selection,
                :current_activite,
                :raison,
                :object,
                :tip_credito,
                :cod_usuarios
            )
            """;

    public static final String SELECT_ALL_DEMANDE_ATTENTE = "SELECT * FROM demandeindividuel WHERE pos = :pointventeId  AND statut_demande='EN_ATTENTE' OR validation_state ='APPROVED'";
    public static final String SELECT_DEMANDE_INDIVIDUEL_QUERY = "SELECT * FROM demandeindividuel WHERE demandeIndividuel_id = :demandeIndividuelId";

    public static final String UPDATE_STATUT_DEMANDE =  "UPDATE demandeIndividuel SET validation_state = :statut, cod_usuarios = :codUsuarios WHERE demandeIndividuel_id = :demandeindividuel_id";

    public static final String SELECT_ALL_DEMANDE_ATTENTE_BY_DATE_QUERY ="SELECT *  FROM demandeindividuel WHERE pos = :pointventeId AND statut_demande='EN_ATTENTE' AND validation_state IN ('SELECTION','APPROVED') ORDER BY DATE(createdAt) DESC";
}
