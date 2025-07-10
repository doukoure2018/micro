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

   // public static final String SELECT_ALL_DEMANDE_ATTENTE = "SELECT * FROM demandeindividuel WHERE pos = :pointventeId  AND statut_demande='EN_ATTENTE' OR validation_state ='APPROVED'";
   public static final String SELECT_ALL_DEMANDE_ATTENTE =
               """
                  SELECT * FROM demandeindividuel
                  WHERE (
                      (CAST(:agenceId AS BIGINT) IS NOT NULL AND CAST(:pointventeId AS BIGINT) IS NULL AND agence = CAST(:agenceId AS BIGINT)) OR
                      (CAST(:pointventeId AS BIGINT) IS NOT NULL AND pos = CAST(:pointventeId AS BIGINT))
                  )
                  AND (statut_demande = 'EN_ATTENTE' OR validation_state = 'APPROVED')
               """;

    public static final String SELECT_ALL_DEMANDE_ATTENTE_NOTIFICATION_QUERY =
            """
                SELECT * FROM demandeindividuel
                      WHERE (
                          (agence = :agenceId AND :agenceId IS NOT NULL) OR
                          (pos = :pointventeId AND :pointventeId IS NOT NULL)
                      )
                      AND (statut_demande = 'EN_ATTENTE' OR validation_state = 'APPROVED')
            """;
    public static final String SELECT_DEMANDE_INDIVIDUEL_QUERY = "SELECT * FROM demandeindividuel WHERE demandeIndividuel_id = :demandeIndividuelId";

    public static final String UPDATE_STATUT_DEMANDE =  "UPDATE demandeIndividuel SET validation_state = :statut, cod_usuarios = :codUsuarios WHERE demandeIndividuel_id = :demandeindividuel_id";

    public static final String SELECT_ALL_DEMANDE_ATTENTE_BY_DATE_QUERY ="SELECT *  FROM demandeindividuel WHERE pos = :pointventeId AND statut_demande='EN_ATTENTE' AND validation_state IN ('SELECTION','APPROVED') ORDER BY DATE(createdAt) DESC";
    public static final String EXIST_NUMERO_MEMBRE ="SELECT *  FROM individuel WHERE numero_membre = :numeroMembre";
    public static final String GET_LAST_DEMANDE_INDIDIVIDUEL_BY_NUMBERO_MEMBRE_QUERY ="SELECT * FROM demandeIndividuel WHERE numero_membre = :numeroMembre ORDER BY createdAt DESC LIMIT 1";

 public static final String INSERT_START_NEW_CREDIT =
         """
             INSERT INTO credit(
                 reference_credit, type_credit, status, create_at, code_membre,
                 delegation_id, agence_id, pointvente_id, individuel_id, user_id, "montantCredit")
             VALUES (:referenceCredit, :typeCredit, :status, :createAt, :codeMembre,
                     :delegationId, :agenceId, :pointventeId, :individuelId, :userId, :montantCredit)
         """;


    public static final String INSERT_NEW_INDIVIDUEL_QUERY = "INSERT INTO individuel(numero_membre,user_id) VALUES (:numeroMembre,:userId)";
    public static final String COUNT_NUMBER_OF_INDIVIDUEL_BY_NUMERO_MEMBRE = "SELECT COUNT(*) FROM individuel WHERE numero_membre = :numeroMembre";

//    public static final String SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE = "SELECT * FROM individuel WHERE numero_membre = :numeroMembre";

    public static final String UPDATE_STATUT_DEMANDE_QUERY =  "UPDATE demandeIndividuel SET statut_demande = 'IS_EFFECTIVE' WHERE demandeIndividuel_id = :demandeindividuel_id";


    public static final String INSERT_OCCURENCE_QUERY = "INSERT INTO occurence_credit(cod_membre_ind,created_at,state_credit,reference_credit,statut,individuel_id,user_id) VALUES(:numeroMembre,:createdAt,:stateCredit,:referenceCredit,:statut,:individuelId,:userId)";


    public static final String GET_LAST_CREDIT_QUERY =
                                """
                                     SELECT * FROM credit c INNER JOIN users u ON c.user_id = u.user_id  WHERE u.agence_id = :agenceId AND status='ENCOURS'
                                           
                                """;
    public static final String GET_INSTANCE_CREDIT_QUERY =
                                """
                                  SELECT
                                              c.*,
                                              p.moyen_person, p.bien, p.capital, p.creance, p.dette, p.statut_activite,
                                              p.experience, p.lieux_act, p.person_emp, p.lien, p.nombre, p.cumul_credit, p.nbre_credit,
                                              f.frequence, f.created_ate AS frequence_created_at,
                                              g.libele AS garantie_libele, g.montant AS garantie_montant, g.created_at AS garantie_created_at,
                                              l.it_ass, l.it_pc,
                                              oc.state_credit, oc.state_note, oc.note_profile, oc.note_analyse, oc.note_garantie, oc.statut AS occurence_statut
                                          FROM
                                              credit c
                                          INNER JOIN
                                              petit_credit p ON c.reference_credit = p.reference_credit
                                          LEFT JOIN
                                              frequence f ON c.reference_credit = f.reference_credit
                                          LEFT JOIN
                                              garantieMat g ON c.reference_credit = g.reference_credit
                                          LEFT JOIN
                                              localisation l ON c.reference_credit = l.reference_credit
                                          LEFT JOIN
                                              (SELECT * FROM occurence_credit WHERE occurence_credit_id = (
                                                  SELECT MAX(occurence_credit_id) FROM occurence_credit oc
                                                  WHERE oc.reference_credit = :referenceCredit
                                              )) oc ON c.reference_credit = oc.reference_credit
                                          WHERE
                                              c.reference_credit = :referenceCredit
                                """;

    public static final String SELECT_ALL_PRODUCT_BY_REF_QUERY =
            """
               SELECT * FROM produit_ind WHERE reference_credit=:referenceCredit
            """;

    public static final String SELECT_ALL_CHARGE_BY_REF_QUERY =
            """
               SELECT * FROM charges_indi WHERE reference_credit=:referenceCredit
            """;

    public static final String SELECT_ALL_GARANTIE_PERSONNE_CAUTION_BY_REF_QUERY =
            """
               SELECT * FROM garantiepersonnecaution WHERE reference_credit=:referenceCredit
            """;

    public static final String ADD_NOTE_PROFILE_QUERY =
            """
               INSERT INTO note_profile
               (reference_credit, note, motif, created_at, status_note, user_id)
               VALUES
               (:referenceCredit, :note, :motif, :createdAt, :statusNote, :userId)
            """;

    public static final String ADD_NOTE_ANALYSE_QUERY =
                                """
                                   INSERT INTO note_analyse (reference_credit, note, motif, status_note, created_at, user_id)
                                   VALUES (:referenceCredit, :note, :motif, :statusNote, :createdAt, :userId)
                                """;

    public static final String ADD_NOTE_GARANTIE_QUERY =
                                """
                                   INSERT INTO note_garantie (reference_credit, note, motif, status_note, created_at, user_id)
                                   VALUES (:referenceCredit, :note, :motif, :statusNote, :createdAt, :userId)
                                """;
    public static final String GET_LAST_NOTE_PROFILE_QUERY =
                """
                    SELECT * FROM note_profile
                    WHERE reference_credit=:referenceCredit
                    AND status_note='ENCOURS'
                    ORDER BY created_At DESC
                    LIMIT 1
                """;
    public static final String GET_LAST_NOTE_ANALYSE_QUERY =
            """
                SELECT * FROM note_analyse
                WHERE reference_credit=:referenceCredit
                AND status_note='ENCOURS'
                ORDER BY created_At DESC
                LIMIT 1
            """;
    public static final String GET_LAST_NOTE_GARANTIE_QUERY =
            """
                SELECT * FROM note_garantie
                WHERE reference_credit=:referenceCredit
                 AND status_note='ENCOURS'
                ORDER BY created_At DESC
                LIMIT 1
            """;


    public static final String CALCULATE_NOTES_AND_UDPATE_QUERY =
            """
            SELECT * FROM calculate_notes_and_update_credit(
                :referenceCredit,
                :userId,
                :threshold,
                :motif,
                :montantSuggere,
                :montantDemande
            )
            """;

    public static final String SELECT_ALL_CREDIT_QUERY = "SELECT * FROM credit WHERE pointvente_id = :pointventeId  AND status IN ('ACCEPTED','REJECTED')";

    public static final String COUNT_NUMBER_OF_DEMANDE_IND_APPROVED = "SELECT COUNT(*)  FROM demandeindividuel WHERE pos = :pointventeId AND statut_demande='EN_ATTENTE' AND validation_state IN ('SELECTION','APPROVED')";

    public static final String SELECT_APPRECIATION_BY_REFERENCE_CREDIT = "SELECT * FROM appreciation WHERE reference_credit=:referenceCredit ORDER BY created_at DESC LIMIT 1";

    public static final String UPDATE_STATE_CREDIT_STATUT_QUERY =
                    """
                        UPDATE credit
                                SET status = 'IS_OK'
                                FROM (
                                    SELECT credit_id
                                    FROM credit
                                    WHERE reference_credit = :referenceCredit AND status = 'ACCEPTED'
                                    ORDER BY create_at DESC
                                    LIMIT 1
                                ) latest
                                WHERE credit.credit_id = latest.credit_id;
                    """;

    public static final String UPDATE_STATE_OCCURENCE_STATUT_QUERY =
            "UPDATE occurence_credit " +
                    "SET statut = 'IS_OK' " +
                    "FROM ( " +
                    "SELECT occurence_credit_id " +
                    "FROM occurence_credit " +
                    "WHERE reference_credit = :referenceCredit AND statut = 'ENCOURS' " +
                    "ORDER BY created_at DESC " +
                    "LIMIT 1 " +
                    ") latest " +
                    "WHERE occurence_credit.occurence_credit_id = latest.occurence_credit_id";
    public static final String SELECT_CREDIT_INFO_BY_REFERENCE_CREDIT = "SELECT * FROM credit WHERE reference_credit=:referenceCredit AND status='ACCEPTED' ORDER BY create_at DESC LIMIT 1";
    public static final String SELECT_CREDIT_BY_REFERENCE_CREDIT = "SELECT * FROM credit WHERE reference_credit=:referenceCredit";
    public static final String SELECT_DEMANDE_CREDIT_BY_USER_ID_QUERY = "SELECT * FROM demande_credit WHERE statut='VUE'";

}
