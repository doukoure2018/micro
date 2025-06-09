package io.digiservices.ecreditservice.query;

public class IndividuelQuery {

    public static final String CREATE_INDIVIDUEL_QUERY =
            """
               INSERT INTO individuel (
                   created_at,
                   cat_membre,
                   numero_membre,
                   nom,
                   prenom,
                   date_naissance,
                   lieux_naissance,
                   nationalite,
                   telephone,
                   telephone2,
                   type_piece,
                   numero_piece,
                   sexe,
                   profession,
                   nom_pere,
                   nom_mere,
                   activite,
                   nbre_enfant,
                   nbre_parent,
                   nbre_autre,
                   quartier,
                   district,
                   secteur,
                   cotisation,
                   droit_entree,
                   type_habitation,
                   nbre_annee,
                   statutIndividuel,
                   prestataire,
                   codCanton,
                   ville,
                   typeEntreprise,
                   lienParente,
                   nomParent,
                   conjoint,
                   nbreAnneeH,
                   adresse,
                   expiration_date,
                   user_id
               )
               VALUES (
                   :createdAt,
                   :catMembre,
                   :numeroMembre,
                   :nom,
                   :prenom,
                   :dateNaissance,
                   :lieuxNaissance,
                   :nationalite,
                   :telephone,
                   :telephone2,
                   :typePiece,
                   :numeroPiece,
                   :sexe,
                   :profession,
                   :nomPere,
                   :nomMere,
                   :activite,
                   :nbreEnfant,
                   :nbreParent,
                   :nbreAutre,
                   :quartier,
                   :district,
                   :secteur,
                   :cotisation,
                   :droitEntree,
                   :typeHabitation,
                   :nbreAnnee,
                   :statutIndividuel,
                   :prestataire,
                   :codCanton,
                   :ville,
                   :typeEntreprise,
                   :lienParente,
                   :nomParent,
                   :conjoint,
                   :nbreAnneeH,
                   :adresse,
                   :expirationDate,
                   :userId
               )
               """;

    public static final String COUNT_NUMERO_MEMBRE = "SELECT COUNT(*) FROM individuel WHERE numero_membre = :numeroMembre";


    public static final String SELECT_INDIVIDUEL_BY_NUMERO_MEMBRE =
            """
              SELECT * FROM individuel WHERE numero_membre = :numeroMembre
            """;

    public static final String PROCESS_INDIVIDUEL_QUERY =
                        """
                            SELECT insert_credit_data(
                                :moyenPerson,
                                :bien,
                                :capital,
                                :creance,
                                :dette,
                                :statutActivite,
                                :experience,
                                :lieuxAct,
                                :personEmp,
                                :lien,
                                :nombre,
                                :referenceCredit,
                                :cumulCredit,
                                :nbreCredit,
                                :frequence,
                                :garantieLibele,
                                :garantieMontant,
                                :itAss,
                                :itPc,
                                :produitsLibele,
                                :produitsPrixUnit,
                                :produitsQte,
                                :produitsObservation,
                                :chargesLibele,
                                :chargesPrixUnit,
                                :chargesQte,
                                :cautionsNom,
                                :cautionsPrenom,
                                :cautionsTelephone,
                                :cautionsActivite,
                                :cautionsAge,
                                :cautionsProfession
                            ) AS success
                        """;


    public static final String SELECT_CREDIT_DTO_QUERY = "SELECT * FROM credit WHERE code_membre = :numeroMembre AND status ='ENCOURS' ORDER BY create_at DESC LIMIT 1";


    public static final String GET_LAST_DEMANDE_BY_NUMBERO_MEMBRE_QUERY ="SELECT * FROM demandeIndividuel WHERE statut_demande='EN_ATTENTE' AND validation_state='VALIDATION' AND numero_membre = :numeroMembre ORDER BY createdAt DESC LIMIT 1";

}
