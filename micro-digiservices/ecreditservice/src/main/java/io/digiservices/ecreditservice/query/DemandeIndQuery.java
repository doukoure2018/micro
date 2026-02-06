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
           SELECT
               demandeindividuel_id as "demandeIndividuelId",
               nom, prenom, telephone,
               numero_membre as "numeroMembre",
               delegation, agence, pos,
               type_piece as "typePiece",
               numId as "numId",
               date_naissance as "dateNaissance",
               lieux_naissance as "lieuxNaissance",
               genre,
               situation_matrimoniale as "situationMatrimoniale",
               nombre_personne_en_charge as "nombrePersonneEnCharge",
               nombre_personne_scolarise as "nombrePersonneScolarise",
               addresse_domicile_contact as "addresseDomicileContact",
               type_propriete as "typePropriete",
               nombre_annee_habitation as "nombreAnneeHabitation",
               type_activite as "typeActivite",
               sous_activite as "sousActivite",
               sous_sous_activite as "sousSousActivite",
               description_activite as "descriptionActivite",
               nombre_annee_activite as "nombreAnneeActivite",
               adresse_lieu_activite as "adresseLieuActivite",
               autre_activite as "autreActivite",
               lieu_activite as "lieuActivite",
               montant_demande as "montantDemande",
               duree_demande as "dureeDemande",
               periodicite_remboursement as "periodiciteRemboursement",
               taux_interet as "tauxInteret",
               periode_differe as "periodeDiffere",
               nombre_echeance as "nombreEcheance",
               echeance,
               object_credit as "objectCredit",
               detail_object_credit as "detailObjectCredit",
               statut_credit as "statutCredit",
               rang_credit as "rangCredit",
               tip_credito as "tipCredito",
               cod_usuarios as "codUsuarios",
               statut_demande as "statutDemande",
               validation_state as "validationState",
               current_activite as "currentActivite",
               statut_selection as "statutSelection",
               createdAt as "createdAt"
           FROM demandeindividuel
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

    public static final String UPDATE_STATUT_DEMANDE =  "UPDATE demandeIndividuel SET validation_state = :statut, cod_usuarios = :codUsuarios WHERE demandeIndividuel_id = :demandeindividuel_id";

    public static final String SELECT_ALL_DEMANDE_ATTENTE_BY_DATE_QUERY =
                    """
                             SELECT
                            		    demandeindividuel_id as "demandeIndividuelId",
                                           nom, prenom, telephone,
                                           numero_membre as "numeroMembre",
                                           delegation, agence, pos,
                                           type_piece as "typePiece",
                                           numId as "numId",
                                           date_naissance as "dateNaissance",
                                           lieux_naissance as "lieuxNaissance",
                                           genre,
                                           situation_matrimoniale as "situationMatrimoniale",
                                           nombre_personne_en_charge as "nombrePersonneEnCharge",
                                           nombre_personne_scolarise as "nombrePersonneScolarise",
                                           addresse_domicile_contact as "addresseDomicileContact",
                                           type_propriete as "typePropriete",
                                           nombre_annee_habitation as "nombreAnneeHabitation",
                                           type_activite as "typeActivite",
                                           sous_activite as "sousActivite",
                                           sous_sous_activite as "sousSousActivite",
                                           description_activite as "descriptionActivite",
                                           nombre_annee_activite as "nombreAnneeActivite",
                                           adresse_lieu_activite as "adresseLieuActivite",
                                           autre_activite as "autreActivite",
                                           lieu_activite as "lieuActivite",
                                           montant_demande as "montantDemande",
                                           duree_demande as "dureeDemande",
                                           periodicite_remboursement as "periodiciteRemboursement",
                                           taux_interet as "tauxInteret",
                                           periode_differe as "periodeDiffere",
                                           nombre_echeance as "nombreEcheance",
                                           echeance,
                                           object_credit as "objectCredit",
                                           detail_object_credit as "detailObjectCredit",
                                           statut_credit as "statutCredit",
                                           rang_credit as "rangCredit",
                                           tip_credito as "tipCredito",
                                           cod_usuarios as "codUsuarios",
                                           statut_demande as "statutDemande",
                                           validation_state as "validationState",
                                           current_activite as "currentActivite",
                                           statut_selection as "statutSelection",
                                           createdAt as "createdAt"
                            		  
                            		   FROM demandeindividuel WHERE pos = :pointventeId
                            		   AND statut_demande='EN_ATTENTE'
                            		   AND validation_state IN ('SELECTION','APPROVED') ORDER BY DATE(createdAt) DESC
                    """;

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




    /**
     * Appel de la procédure stockée pour insérer une demande avec ses garanties
     */
    public static final String CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC =
            """
            SELECT * FROM insert_demande_with_garanties(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?::garantie_input[]
            )
            """;


    public static final String CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC_V2 =
            """
            SELECT * FROM insert_demande_with_garanties(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?::garantie_input[]
            )
            """;

    /**
     * Requête pour appeler la procédure stockée d'insertion de demande avec garanties
     * Version 3 - Ajout de 8 nouveaux paramètres (paramètres 45-52)
     * Total: 53 paramètres (52 champs + 1 tableau de garanties)
     */
    public static final String CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC_V3 =
            """
            SELECT * FROM insert_demande_with_garanties(
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?, ?, ?,
                ?::garantie_input[]
            )
            """;

    /**
     * Appel de la procédure stockée insert_demande_with_garanties
     * Version V80 avec 55 paramètres (incluant email et sigle)
     */
    public static final String CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC_V4 =
            "SELECT * FROM insert_demande_with_garanties(" +
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 1-10
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 11-20
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 21-30
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 31-40
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 41-50
                    "?, ?, ?, ?, ?)";                    // 51-55

    /**
     * Appel de la procédure stockée insert_demande_with_garanties
     * Version V94 avec 57 paramètres (incluant profession et secteur_activite)
     *
     * Paramètres:
     * 1-4: nom, prenom, telephone, numero_membre
     * 5-7: delegation, agence, pos
     * 8-9: type_piece, numid
     * 10-18: date_naissance, lieux_naissance, genre, situation_matrimoniale,
     *        nombre_personne_en_charge, nombre_personne_scolarise,
     *        addresse_domicile_contact, type_propriete, nombre_annee_habitation
     * 19-26: type_activite, sous_activite, sous_sous_activite, description_activite,
     *        nombre_annee_activite, adresse_lieu_activite, autre_activite, lieu_activite
     * 27-35: montant_demande, duree_demande, periodicite_remboursement, taux_interet,
     *        periode_differe, nombre_echeance, echeance, object_credit, detail_object_credit
     * 36-42: statut_credit, rang_credit, tip_credito, cod_usuarios,
     *        statut_demande, validation_state, current_activite
     * 43-44: nature_client, nom_personne_morale
     * 45-52: sernom, categorie, nom_pere, nom_mere, nom_conjoint,
     *        nature_activite, prefecture, sous_prefecture
     * 53-54: email, sigle
     * 55-56: profession, secteur_activite (NOUVEAUX V94)
     * 57: garanties (array)
     */
    public static final String CALL_INSERT_DEMANDE_WITH_GARANTIES_PROC_V5 =
            "SELECT * FROM insert_demande_with_garanties(" +
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 1-10
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 11-20
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 21-30
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 31-40
                    "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, " +  // 41-50
                    "?, ?, ?, ?, ?, ?, ?)";              // 51-57

    /**
     * Requête pour récupérer une demande avec ses garanties
     */
    public static final String SELECT_DEMANDE_WITH_GARANTIES =
            "SELECT d.*, " +
                    "g.garantie_propose_id, g.type_garantie, g.description_garantie, " +
                    "g.valeur_garantie, g.valeur_emprunte " +
                    "FROM demandeindividuel d " +
                    "LEFT JOIN garantie_propose g ON d.demandeindividuel_id = g.demandeindividuel_id " +
                    "WHERE d.demandeindividuel_id = ?";

    /**
     * Requête pour rechercher des demandes par email
     */
    public static final String SELECT_DEMANDE_BY_EMAIL =
            "SELECT * FROM demandeindividuel WHERE email = ?";

    /**
     * Requête pour rechercher des demandes PME/PMI par sigle
     */
    public static final String SELECT_DEMANDE_BY_SIGLE =
            "SELECT * FROM demandeindividuel WHERE sigle ILIKE ? AND nature_client = 'Demande de Credit Pour PME/PMI'";


    /**
     * Appel de la fonction pour récupérer une demande avec ses garanties
     */
    public static final String CALL_GET_DEMANDE_WITH_GARANTIES_FUNC =
            "SELECT * FROM get_demande_with_garanties(?)";

    // Ajout de la requête INSERT modifiée pour la nouvelle structure
    public static final String INSERT_NEW_DEMANDE_IND_COMPLETE_QUERY =
            """
            INSERT INTO demandeIndividuel (
                nom, prenom, telephone, numero_membre,
                delegation, agence, pos,
                type_piece, numId, date_naissance, lieux_naissance,
                genre, situation_matrimoniale,
                nombre_personne_en_charge, nombre_personne_scolarise,
                addresse_domicile_contact, type_propriete, nombre_annee_habitation,
                type_activite, sous_activite, sous_sous_activite,
                description_activite, nombre_annee_activite,
                adresse_lieu_activite, autre_activite, lieu_activite,
                montant_demande, duree_demande, periodicite_remboursement,
                taux_interet, periode_differe, nombre_echeance, echeance,
                object_credit, detail_object_credit,
                statut_credit, rang_credit,
                tip_credito, cod_usuarios,
                statut_demande, validation_state, current_activite,
                createdAt
            ) VALUES (
                :nom, :prenom, :telephone, :numero_membre,
                :delegation, :agence, :pos,
                :type_piece, :numId, :date_naissance, :lieux_naissance,
                :genre, :situation_matrimoniale,
                :nombre_personne_en_charge, :nombre_personne_scolarise,
                :addresse_domicile_contact, :type_propriete, :nombre_annee_habitation,
                :type_activite, :sous_activite, :sous_sous_activite,
                :description_activite, :nombre_annee_activite,
                :adresse_lieu_activite, :autre_activite, :lieu_activite,
                :montant_demande, :duree_demande, :periodicite_remboursement,
                :taux_interet, :periode_differe, :nombre_echeance, :echeance,
                :object_credit, :detail_object_credit,
                :statut_credit, :rang_credit,
                :tip_credito, :cod_usuarios,
                :statut_demande, :validation_state, :current_activite,
                CURRENT_TIMESTAMP
            )
            """;


    public static final String CALL_GET_ALL_DEMANDES_WITH_GARANTIES_FUNC =
            "SELECT * FROM get_all_demandes_with_garanties(?, ?)";


    public static final String GET_INSTANCE_DEMANDE_INDIVIDUEL_BY_ID_QUERY =
                    """
                       SELECT
                               demandeindividuel_id as "demandeIndividuelId",
                                      nom, prenom, telephone,
                                      numero_membre as "numeroMembre",
                                      delegation, agence, pos,
                                      type_piece as "typePiece",
                                      numId as "numId",
                                      date_naissance as "dateNaissance",
                                      lieux_naissance as "lieuxNaissance",
                                      genre,
                                      situation_matrimoniale as "situationMatrimoniale",
                                      nombre_personne_en_charge as "nombrePersonneEnCharge",
                                      nombre_personne_scolarise as "nombrePersonneScolarise",
                                      addresse_domicile_contact as "addresseDomicileContact",
                                      type_propriete as "typePropriete",
                                      nombre_annee_habitation as "nombreAnneeHabitation",
                                      type_activite as "typeActivite",
                                      sous_activite as "sousActivite",
                                      sous_sous_activite as "sousSousActivite",
                                      description_activite as "descriptionActivite",
                                      nombre_annee_activite as "nombreAnneeActivite",
                                      adresse_lieu_activite as "adresseLieuActivite",
                                      autre_activite as "autreActivite",
                                      lieu_activite as "lieuActivite",
                                      montant_demande as "montantDemande",
                                      duree_demande as "dureeDemande",
                                      periodicite_remboursement as "periodiciteRemboursement",
                                      taux_interet as "tauxInteret",
                                      periode_differe as "periodeDiffere",
                                      nombre_echeance as "nombreEcheance",
                                      echeance,
                                      object_credit as "objectCredit",
                                      detail_object_credit as "detailObjectCredit",
                                      statut_credit as "statutCredit",
                                      rang_credit as "rangCredit",
                                      tip_credito as "tipCredito",
                                      cod_usuarios as "codUsuarios",
                                      statut_demande as "statutDemande",
                                      validation_state as "validationState",
                                      current_activite as "currentActivite",
                                      statut_selection as "statutSelection",
                                      createdAt as "createdAt"
                               FROM demandeIndividuel WHERE demandeindividuel_id = :demandeIndividuelId
                    """;


   public static final String CHECK_DEMANDE_EXIST =
           """
               SELECT COUNT(*) > 0
               FROM demandeindividuel WHERE demandeindividuel_id = :demandeindividuelId
         """;

   public static final String UPDATE_STATUT_REJET_DEMANDE_QUERY =  "UPDATE demandeIndividuel SET statut_demande = 'REJET', createdat = NOW() WHERE demandeIndividuel_id = :demandeindividuel_id";


    public static final String LIST_CREDIT_PAR_DELEGATION = """
        SELECT 
            d.demandeindividuel_id,
            d.nom,
            d.prenom,
            d.telephone,
            d.age,
            d.numero_membre,
            d.delegation,
            d.agence,
            d.pos,
            d.createdat,
            d.statut_demande,
            d.validation_state,
            d.statut_selection,
            d.current_activite,
            d.montant_demande,
            d.duree_demande,
            d.periodicite_remboursement,
            d.taux_interet,
            d.nombre_echeance,
            d.echeance,
            d.description_activite,
            d.nature_client,
            d.object_credit,
            d.statut_credit,
            d.rang_credit,
            del.id AS delegation_id,
            del.libele AS delegation_libele,
            ag.libele AS agence_libele,
            pv.libele AS point_vente_libele
        FROM demandeindividuel d
        LEFT JOIN delegation del ON d.delegation = del.id
        LEFT JOIN agence ag ON d.agence = ag.id
        LEFT JOIN pointvente pv ON d.pos = pv.id
        WHERE d.statut_demande = 'EN_ATTENTE'
          AND d.validation_state IN ('NOUVEAU', 'SELECTION', 'APPROVED')
        ORDER BY del.libele, d.createdat DESC
        """;
    public static final String LIST_ALL_DELEGATIONS = """
        SELECT id, libele FROM delegation ORDER BY libele
        """;


}
